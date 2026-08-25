import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, test } from 'node:test'

import { getNovaPoshtaApiData } from './get-np-api-data.server'

const originalFetch = globalThis.fetch
const originalApiUrl = process.env.NOVA_POSHTA_API_URL
const originalApiKey = process.env.NOVA_POSHTA_API_KEY
const originalConsoleError = console.error

describe('getNovaPoshtaApiData', () => {
  beforeEach(() => {
    process.env.NOVA_POSHTA_API_URL = 'https://nova-poshta.test/api'
    process.env.NOVA_POSHTA_API_KEY = 'test-key'
    console.error = () => undefined
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    console.error = originalConsoleError

    if (originalApiUrl === undefined) delete process.env.NOVA_POSHTA_API_URL
    else process.env.NOVA_POSHTA_API_URL = originalApiUrl

    if (originalApiKey === undefined) delete process.env.NOVA_POSHTA_API_KEY
    else process.env.NOVA_POSHTA_API_KEY = originalApiKey
  })

  test('sends an uncached request with a timeout signal', async () => {
    let requestInit: RequestInit | undefined

    globalThis.fetch = (async (_input, init) => {
      requestInit = init
      return Response.json({ success: true, data: [] })
    }) as typeof fetch

    const response = await getNovaPoshtaApiData<[]>('getWarehouses', {
      CityRef: 'city-ref',
    })

    assert.equal(response.success, true)
    assert.equal(requestInit?.cache, 'no-store')
    assert.ok(requestInit?.signal instanceof AbortSignal)
  })

  test('retries a failed HTTP request once', async () => {
    let attempts = 0

    globalThis.fetch = (async () => {
      attempts += 1

      return attempts === 1
        ? new Response(null, { status: 503 })
        : Response.json({ success: true, data: [] })
    }) as typeof fetch

    await getNovaPoshtaApiData<[]>('getWarehouses', {
      CityRef: 'city-ref',
    })

    assert.equal(attempts, 2)
  })

  test('rejects an API-level error instead of returning an empty list', async () => {
    let attempts = 0

    globalThis.fetch = (async () => {
      attempts += 1
      return Response.json({
        success: false,
        data: [],
        errors: ['Rate limit exceeded'],
      })
    }) as typeof fetch

    await assert.rejects(
      getNovaPoshtaApiData<[]>('getWarehouses', {
        CityRef: 'city-ref',
      }),
      /Unable to load Nova Poshta getWarehouses data/,
    )

    assert.equal(attempts, 2)
  })
})
