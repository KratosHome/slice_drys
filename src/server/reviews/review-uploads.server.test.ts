import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('chunk uploads enforce original limits, ownership, immutable retries, completeness, expiry and single consumption', () => {
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    import { REVIEW_MAX_PHOTO_BYTES, REVIEW_UPLOAD_CHUNK_BYTES, REVIEW_UPLOAD_STORAGE_BUDGET_BYTES } from './src/constants/product-review.ts'
    mock.module('server-only', () => ({}))
    mock.module('@/server/connect-to-db.server', () => ({ connectToDbServer: async () => {} }))
    const productId = '111111111111111111111111'
    mock.module('@/server/products/product-schema.server', () => ({ Product: { exists: async filter => filter._id === productId } }))
    const sessions = new Map(), chunks = new Map()
    let binaryReads = 0
    let slots = [], failSessionCreate = false, failChunkDelete = false, firstQuotaUpsert = true
    const expression = value => {
      if (value === '$slots') return slots
      if (value === '$slots.bytes') return slots.map(slot => slot.bytes)
      if (Array.isArray(value)) return value.map(expression)
      if (!value || typeof value !== 'object') return value
      const [operator, operands] = Object.entries(value)[0]
      const args = expression(operands)
      switch (operator) {
        case '$and': return args.every(Boolean)
        case '$lte': return args[0] <= args[1]
        case '$lt': return args[0] < args[1]
        case '$add': case '$sum': return args.reduce((sum,n) => sum+n,0)
        case '$ifNull': return args[0] ?? args[1]
        case '$size': return args.length
        default: throw new Error('Unexpected Mongo expression '+operator)
      }
    }
    const matches = (row, filter) => row && Object.entries(filter).every(([key, value]) => {
      if (value && typeof value === 'object' && '$gt' in value) return row[key] > value.$gt
      return String(row[key]) === String(value)
    })
    const query = value => ({ select() { return this }, sort() { if (Array.isArray(value)) value.sort((a,b) => a.fileIndex-b.fileIndex || a.chunkIndex-b.chunkIndex); return this }, lean: async () => value })
    mock.module('@/server/reviews/review-upload-schema.server', () => ({
      ReviewUploadSession: {
        create: async data => { if (failSessionCreate) throw new Error('Database write failed'); sessions.set(data._id, data); return data },
        findOne: filter => query([...sessions.values()].find(row => matches(row, filter)) ?? null),
        exists: async filter => [...sessions.values()].some(row => matches(row, filter)),
        findOneAndUpdate: (filter, update) => {
          const row = [...sessions.values()].find(row => matches(row, filter))
          if (row) Object.assign(row, update.$set)
          return query(row ?? null)
        },
        deleteOne: async filter => { for (const [id,row] of sessions) if (matches(row,filter)) sessions.delete(id) },
      },
      ReviewUploadChunk: {
        create: async data => {
          if (chunks.has(data._id)) throw { code: 11000 }
          chunks.set(data._id, { ...data, data: { buffer: data.data } })
        },
        findById: id => query(chunks.get(id) ?? null),
        countDocuments: async filter => [...chunks.values()].filter(row => matches(row, filter)).length,
        find: filter => { binaryReads++; return query([...chunks.values()].filter(row => matches(row, filter))) },
        deleteOne: async filter => chunks.delete(filter._id),
        deleteMany: async filter => { if (failChunkDelete) throw new Error('Deletion failed'); for (const [id,row] of chunks) if (matches(row,filter)) chunks.delete(id) },
      },
      ReviewUploadQuota: {
        updateOne: async (filter, update, options) => {
          if (options?.upsert && firstQuotaUpsert) { firstQuotaUpsert = false; throw {code:11000} }
          const remove = update.$pull.slots
          if (remove.expiresAt) slots = slots.filter(slot => slot.expiresAt > remove.expiresAt.$lte)
          else slots = slots.filter(slot => slot.uploadId !== remove.uploadId || slot.tokenHash !== remove.tokenHash)
        },
        findOneAndUpdate: (filter, update) => {
          assert.ok(filter.$expr, 'quota must use an atomic conditional update')
          if (!expression(filter.$expr)) return query(null)
          slots.push(update.$push.slots)
          return query({_id:filter._id})
        },
        exists: async filter => slots.some(slot => matches(slot,filter.slots.$elemMatch)),
      },
    }))
    const api = await import('./src/server/reviews/review-uploads.server.ts')
    const descriptor = (size, type = 'image/jpeg', name = 'photo.jpg') => ({ name, type, size })
    const create = files => api.createReviewUpload({ productId, files })
    for (const files of [[], [descriptor(0)], [descriptor(REVIEW_MAX_PHOTO_BYTES + 1)], [descriptor(1.5)], [descriptor(1,'image/svg+xml')], Array(4).fill(descriptor(1))]) {
      await assert.rejects(create(files), error => error.statusCode === 400)
    }
    await assert.rejects(api.createReviewUpload({ productId, files: [descriptor(1)], website: 'bot' }), error => error.statusCode === 400)
    await assert.rejects(api.createReviewUpload({ productId: '999999999999999999999999', files: [descriptor(1)] }), error => error.statusCode === 404)
    assert.equal(sessions.size, 0)
    const request = (bytes, headers = {}) => new Request('https://shop.example/chunk', {
      method: 'PUT', body: bytes, headers: { 'Content-Type': 'application/octet-stream', ...headers },
    })
    const small = await create([descriptor(3)])
    assert.match(small.uploadId, /^[a-f0-9]{32}$/)
    assert.match(small.uploadToken, /^[a-f0-9]{64}$/)
    assert.equal(small.chunkBytes, REVIEW_UPLOAD_CHUNK_BYTES)
    assert.equal(JSON.stringify([...sessions.values()]).includes(small.uploadToken), false)
    const put = (slot, bytes, fi = '0', ci = '0', token = slot.uploadToken, headers = {}) => api.storeReviewUploadChunk(request(bytes, headers), slot.uploadId, token, fi, ci)
    await assert.rejects(put(small, new Uint8Array([1,2,3]), '0','0','0'.repeat(64)), error => error.statusCode === 404)
    await assert.rejects(put(small, new Uint8Array([1,2,3]), '1'), error => error.statusCode === 400)
    await assert.rejects(put(small, new Uint8Array([1,2,3]), '0','01'), error => error.statusCode === 400)
    await assert.rejects(put(small, new Uint8Array([1,2])), error => error.statusCode === 400)
    await assert.rejects(put(small, new Uint8Array([1,2,3,4])), error => error.statusCode === 413)
    await assert.rejects(put(small, new Uint8Array([1,2,3]), '0','0',small.uploadToken, { 'Content-Length': '999' }), error => error.statusCode === 400)
    await assert.rejects(put(small, new Uint8Array([1,2,3]), '0','0',small.uploadToken, { 'Content-Type': 'image/jpeg' }), error => error.statusCode === 415)
    await assert.rejects(api.claimReviewUpload(small.uploadId,small.uploadToken,productId), error => error.statusCode === 409)
    assert.equal(sessions.get(small.uploadId).state,'open','missing chunks do not consume the upload')
    assert.equal(binaryReads,0,'incomplete claims never load binary data')
    await put(small,new Uint8Array([1,2,3]))
    await put(small,new Uint8Array([1,2,3]))
    assert.equal(chunks.size,1,'retry does not duplicate data')
    await assert.rejects(put(small,new Uint8Array([3,2,1])), error => error.statusCode === 409)
    await assert.rejects(api.claimReviewUpload(small.uploadId,small.uploadToken,'999999999999999999999999'), error => error.statusCode === 400)
    const claims = await Promise.allSettled([api.claimReviewUpload(small.uploadId,small.uploadToken,productId),api.claimReviewUpload(small.uploadId,small.uploadToken,productId)])
    assert.equal(claims.filter(result => result.status === 'fulfilled').length,1)
    assert.equal(binaryReads,1,'only the atomic claim winner reads binary data')
    const result = claims.find(result => result.status === 'fulfilled').value
    assert.deepEqual([...new Uint8Array(await result[0].arrayBuffer())],[1,2,3])
    await assert.rejects(put(small,new Uint8Array([1,2,3])), error => error.statusCode === 404)
    await api.deleteReviewUpload(small.uploadId,'0'.repeat(64))
    assert.equal(sessions.size,1,'wrong token cannot remove another session')
    await api.deleteReviewUpload(small.uploadId,small.uploadToken)
    assert.equal(sessions.size,0); assert.equal(chunks.size,0)
    assert.equal(slots.length,0,'deletion releases reserved storage')
    const large = await create([descriptor(REVIEW_MAX_PHOTO_BYTES,'','PHONE.HEIC'),descriptor(2,'image/png','second.png')])
    assert.equal(sessions.get(large.uploadId).files[0].type,'image/heic')
    const bytes = new Uint8Array(REVIEW_UPLOAD_CHUNK_BYTES).fill(21)
    for (let part = 0; part < REVIEW_MAX_PHOTO_BYTES / REVIEW_UPLOAD_CHUNK_BYTES; part++) await put(large,bytes,'0',String(part))
    await put(large,new Uint8Array([9,8]),'1','0')
    const files = await api.claimReviewUpload(large.uploadId,large.uploadToken,productId)
    assert.equal(files[0].size,20*1024*1024,'20 MiB originals accepted exactly')
    assert.equal(files[0].type,'image/heic')
    assert.equal(files[1].size,2)
    assert.equal(new Uint8Array(await files[0].arrayBuffer()).at(-1),21)
    await api.deleteReviewUpload(large.uploadId,large.uploadToken)
    const corrupted = await create([descriptor(1)])
    await put(corrupted,new Uint8Array([1]))
    chunks.get(corrupted.uploadId+':0:0').hash = 'wrong'
    await assert.rejects(api.claimReviewUpload(corrupted.uploadId,corrupted.uploadToken,productId), error => error.statusCode === 400)
    assert.equal(sessions.has(corrupted.uploadId),false,'failed reconstruction removes the consumed session')
    assert.equal(chunks.size,0,'failed reconstruction cleans private binary data')
    assert.equal(slots.length,0,'failed reconstruction also releases reserved storage')
    const expired = await create([descriptor(1)])
    sessions.get(expired.uploadId).expiresAt = new Date(0)
    await assert.rejects(put(expired,new Uint8Array([1])), error => error.statusCode === 404)
    await assert.rejects(api.claimReviewUpload(expired.uploadId,expired.uploadToken,productId), error => error.statusCode === 404)
    assert.equal(api.reviewUploadBearer(new Request('https://shop.example',{headers:{Authorization:'Bearer '+expired.uploadToken}})),expired.uploadToken)
    assert.throws(() => api.reviewUploadBearer(new Request('https://shop.example')), error => error.statusCode === 404)
    await api.deleteReviewUpload(expired.uploadId,expired.uploadToken)

    failSessionCreate = true
    await assert.rejects(create([descriptor(1)]))
    assert.equal(slots.length,0,'failed session creation does not leak quota')
    failSessionCreate = false
    const maxFiles = Array(3).fill(descriptor(REVIEW_MAX_PHOTO_BYTES))
    const attempts = await Promise.allSettled(Array.from({length:5}, () => create(maxFiles)))
    const accepted = attempts.filter(result => result.status === 'fulfilled').map(result => result.value)
    assert.equal(accepted.length,4,'four 60 MiB sessions fit the 256 MiB budget')
    assert.equal(attempts.find(result => result.status === 'rejected').reason.statusCode,429)
    assert.equal(slots.reduce((sum,slot) => sum+slot.bytes,0),240*1024*1024)
    assert.ok(slots.reduce((sum,slot) => sum+slot.bytes,0) <= REVIEW_UPLOAD_STORAGE_BUDGET_BYTES)
    await api.deleteReviewUpload(accepted[0].uploadId,'0'.repeat(64))
    await assert.rejects(create(maxFiles), error => error.statusCode === 429)
    await api.deleteReviewUpload(accepted[0].uploadId,accepted[0].uploadToken)
    const replacement = await create(maxFiles)
    assert.equal(slots.length,4,'successful cleanup makes room for a maximum request')
    for (const slot of slots) {
      slot.expiresAt = new Date(0)
      sessions.get(slot.uploadId).expiresAt = new Date(0)
    }
    const afterExpiry = await create(maxFiles)
    assert.equal(slots.length,1,'expired reservations are reclaimed on admission without a cron')
    await api.deleteReviewUpload(afterExpiry.uploadId,afterExpiry.uploadToken)
    const cleanupRetry = await create([descriptor(1)])
    await put(cleanupRetry,new Uint8Array([1]))
    failChunkDelete = true
    await assert.rejects(api.deleteReviewUpload(cleanupRetry.uploadId,cleanupRetry.uploadToken))
    assert.equal(sessions.has(cleanupRetry.uploadId),false)
    assert.equal(slots.length,1,'storage stays reserved until binary data is removed')
    failChunkDelete = false
    await api.deleteReviewUpload(cleanupRetry.uploadId,'0'.repeat(64))
    assert.equal(chunks.size,1,'a guessed ID cannot authorize orphan cleanup')
    await api.deleteReviewUpload(cleanupRetry.uploadId,cleanupRetry.uploadToken)
    assert.equal(chunks.size,0); assert.equal(slots.length,0)
    for (let count = 0; count < 256; count++) await create([descriptor(1)])
    await assert.rejects(create([descriptor(1)]),error => error.statusCode === 429)
    assert.equal(slots.length,256,'the reservation document is bounded for tiny files too')
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 20_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})

test('upload sessions and binary chunks have independent TTL cleanup and schema size limits', () => {
  const script = String.raw`
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    mock.module('server-only', () => ({}))
    process.getBuiltinModule('v8').startupSnapshot.isBuildingSnapshot = () => false
    const { ReviewUploadSession, ReviewUploadChunk, ReviewUploadQuota } = await import('./src/server/reviews/review-upload-schema.server.ts')
    for (const model of [ReviewUploadSession,ReviewUploadChunk]) {
      assert.ok(model.schema.indexes().some(([fields, options]) => fields.expiresAt === 1 && options.expireAfterSeconds === 0))
    }
    const base = { _id:'id', tokenHash:'hash', productId:'111111111111111111111111', expiresAt:new Date(), files:[{name:'photo.heic',type:'image/heic',size:20*1024*1024}] }
    await new ReviewUploadSession(base).validate()
    await assert.rejects(new ReviewUploadSession({...base,files:Array(4).fill(base.files[0])}).validate())
    await assert.rejects(new ReviewUploadSession({...base,files:[{...base.files[0],size:20*1024*1024+1}]}).validate())
    const chunk = { _id:'id:0:0',uploadId:'id',fileIndex:0,chunkIndex:0,hash:'hash',data:Buffer.alloc(1024*1024),expiresAt:new Date() }
    await new ReviewUploadChunk(chunk).validate()
    await assert.rejects(new ReviewUploadChunk({...chunk,data:Buffer.alloc(1024*1024+1)}).validate())
    assert.ok(ReviewUploadChunk.schema.indexes().some(([fields, options]) => fields.uploadId === 1 && fields.fileIndex === 1 && fields.chunkIndex === 1 && options.unique))
    const slot = {uploadId:'id',tokenHash:'hash',bytes:60*1024*1024,expiresAt:new Date()}
    await new ReviewUploadQuota({_id:'quota',slots:[slot]}).validate()
    await assert.rejects(new ReviewUploadQuota({_id:'quota',slots:Array(257).fill(slot)}).validate())
    const quotaQuery = ReviewUploadQuota.findOneAndUpdate({_id:'quota',$expr:{$and:[
      {$lte:[{$add:[{$sum:{$ifNull:['$slots.bytes',[]]}},slot.bytes]},256*1024*1024]},
      {$lt:[{$size:{$ifNull:['$slots',[]]}},256]},
    ]}},{$push:{slots:slot}})
    assert.doesNotThrow(() => quotaQuery.cast(ReviewUploadQuota),'the atomic expression casts through the real Mongoose schema')
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 15_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
