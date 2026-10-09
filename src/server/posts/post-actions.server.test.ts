import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { test } from 'node:test'

test('blog actions return access errors without uploading or saving posts', () => {
  // Isolate module mocks from other suites and never use external services.
  const script = `
    import assert from 'node:assert/strict'
    import { mock } from 'bun:test'
    import { ApiError } from './src/server/api-error.server.ts'

    let accessError
    let connections = 0
    let writes = 0
    let uploads = 0
    let deletions = 0
    let reads = 0
    let revalidations = 0
    let loggedErrors = 0
    console.error = () => { loggedErrors += 1 }

    mock.module('@/server/auth/require-admin.server', () => ({
      requirePermission: async (permission) => {
        assert.equal(permission, 'blog:manage')
        if (accessError) throw accessError
      },
    }))
    mock.module('@/server/connect-to-db.server', () => ({
      connectToDbServer: async () => { connections += 1 },
    }))
    mock.module('@/server/cloudinary-config.server', () => ({
      default: { uploader: {
        upload: async () => {
          uploads += 1
          return { secure_url: 'https://image.test/upload/new.webp' }
        },
        destroy: async () => { deletions += 1 },
      } },
    }))
    mock.module('@/server/posts/post-schema.server', () => ({
      Post: class {
        async save() { writes += 1 }
        static async findById() {
          reads += 1
          return { img: 'https://image.test/upload/old.webp' }
        }
        static async findByIdAndUpdate() { writes += 1 }
      },
    }))
    mock.module('next/cache', () => ({
      revalidateTag: () => { revalidations += 1 },
    }))

    const { createPost } = await import('./src/server/posts/create-post.server.ts')
    const { editPostServer } = await import('./src/server/posts/edit-post.server.ts')
    const actions = [
      () => createPost({}, 'data:image/webp;base64,test'),
      () => editPostServer('post-id', {}, 'data:image/webp;base64,test'),
    ]

    for (const [status, message] of [
      [401, 'Сеанс завершився. Увійдіть знову.'],
      [403, 'Недостатньо прав для керування блогом.'],
    ]) {
      accessError = new ApiError(status, 'Internal access detail')
      for (const action of actions) {
        assert.deepEqual(await action(), { success: false, message })
      }
    }
    assert.deepEqual(
      [connections, writes, uploads, deletions, reads, revalidations],
      [0, 0, 0, 0, 0, 0],
    )

    accessError = new Error('Private database detail')
    assert.deepEqual(await actions[0](), {
      success: false, message: 'Не вдалося створити пост',
    })
    assert.deepEqual(await actions[1](), {
      success: false, message: 'Не вдалося оновити пост',
    })
    assert.equal(loggedErrors, 2)

    accessError = undefined
    for (const action of actions) assert.equal((await action()).success, true)
    assert.equal(writes, 2)
    assert.equal(uploads, 2)
    assert.equal(revalidations, 4)
  `

  const result = spawnSync(process.execPath, ['-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    timeout: 10_000,
  })
  assert.equal(result.error, undefined)
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
})
