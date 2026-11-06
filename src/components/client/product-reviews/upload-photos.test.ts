import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('large original photos upload unchanged in bounded authenticated chunks and return only session references', () => {
  const script = String.raw`
    import assert from 'node:assert/strict'
    const { uploadReviewPhotoFiles } = await import('./src/components/client/product-reviews/upload-photos.ts')
    const { REVIEW_UPLOAD_CHUNK_BYTES, REVIEW_MAX_PHOTO_BYTES } = await import('./src/constants/product-review.ts')
    const id = '1'.repeat(32), token = '2'.repeat(64)
    const requests = [], progress = []
    const first = new Uint8Array(REVIEW_UPLOAD_CHUNK_BYTES * 2 + 17).fill(42)
    const second = new Uint8Array(REVIEW_MAX_PHOTO_BYTES).fill(7)
    const files = [new File([first], 'camera.HEIC', { type: '' }), new File([second], 'large.jpg', { type: 'image/jpeg' })]
    const bytesByFile = [[], []]
    globalThis.fetch = async (url, options) => {
      requests.push({ url, options })
      if (options.method === 'POST') {
        assert.equal(url, '/api/product-review-uploads')
        assert.deepEqual(JSON.parse(options.body), { productId:'product', website:'', files: [
          {name:'camera.HEIC',type:'image/heic',size:first.length},
          {name:'large.jpg',type:'image/jpeg',size:second.length},
        ] })
        return Response.json({success:true,data:{uploadId:id,uploadToken:token,chunkBytes:REVIEW_UPLOAD_CHUNK_BYTES}})
      }
      assert.equal(options.method, 'PUT')
      assert.equal(options.headers.Authorization, 'Bearer ' + token)
      assert.equal(options.headers['Content-Type'], 'application/octet-stream')
      assert.ok(options.body instanceof Blob)
      assert.ok(options.body.size <= REVIEW_UPLOAD_CHUNK_BYTES)
      const match = url.match(new RegExp('^/api/product-review-uploads/' + id + '/([01])/(\\d+)$'))
      assert.ok(match)
      const fileIndex = Number(match[1]), chunkIndex = Number(match[2])
      assert.equal(chunkIndex, bytesByFile[fileIndex].length)
      bytesByFile[fileIndex].push(new Uint8Array(await options.body.arrayBuffer()))
      return Response.json({success:true})
    }
    const result = await uploadReviewPhotoFiles({productId:'product',files,website:'',signal:new AbortController().signal,onProgress:value => progress.push(value)})
    assert.deepEqual(result,{uploadId:id,uploadToken:token})
    assert.equal(requests.length,24)
    assert.equal(progress[0],0)
    assert.equal(progress.at(-1),100)
    assert.ok(progress.every((value,index) => index === 0 || value >= progress[index-1]))
    for (let index=0; index<files.length; index++) {
      const reconstructed = new Uint8Array(await new Blob(bytesByFile[index]).arrayBuffer())
      assert.deepEqual(reconstructed,index===0?first:second,'the original is not recompressed or altered in the browser')
    }
    const before = requests.length
    for (const invalid of [[],[...files,files[0],files[0]],[new File([new Uint8Array(REVIEW_MAX_PHOTO_BYTES+1)],'too-big.jpg',{type:'image/jpeg'})]]) {
      await assert.rejects(uploadReviewPhotoFiles({productId:'product',files:invalid,website:'',signal:new AbortController().signal,onProgress:()=>{}}))
    }
    assert.equal(requests.length,before)
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 15_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})

test('upload failures stop subsequent chunks and cannot redirect originals to another URL', () => {
  const script = String.raw`
    import assert from 'node:assert/strict'
    const { uploadReviewPhotoFiles } = await import('./src/components/client/product-reviews/upload-photos.ts')
    const { REVIEW_UPLOAD_CHUNK_BYTES } = await import('./src/constants/product-review.ts')
    const file = new File([new Uint8Array(REVIEW_UPLOAD_CHUNK_BYTES*2+1)],'photo.png',{type:'image/png'})
    const options = {productId:'product',files:[file],website:'',signal:new AbortController().signal,onProgress:()=>{}}
    let requests = 0, badSession = true
    globalThis.fetch = async (url, request) => {
      requests++
      if(request.method==='POST') return Response.json({success:true,data:{uploadId:badSession?'https://evil.example':'1'.repeat(32),uploadToken:'2'.repeat(64),chunkBytes:REVIEW_UPLOAD_CHUNK_BYTES}})
      return Response.json({success:false,message:'Upload expired'},{status:410})
    }
    await assert.rejects(uploadReviewPhotoFiles(options))
    assert.equal(requests,1)
    badSession=false; requests=0
    await assert.rejects(uploadReviewPhotoFiles(options),{message:'Upload expired'})
    assert.equal(requests,2,'no additional chunks are sent after the first failure')
  `
  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 15_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
