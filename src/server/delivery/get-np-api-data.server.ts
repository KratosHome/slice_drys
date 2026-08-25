'use server'

const NOVA_POSHTA_REQUEST_TIMEOUT_MS = 8_000
const NOVA_POSHTA_REQUEST_ATTEMPTS = 2
const NOVA_POSHTA_RETRY_DELAY_MS = 300

const wait = (delay: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, delay))

const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : String(error)

export async function getNovaPoshtaApiData<T>(
  calledMethod: 'getCities' | 'getWarehouses',
  methodProperties?: Record<string, unknown>,
): Promise<INovaPoshtaApiResponse<T>> {
  const API_URL: string | undefined = process.env.NOVA_POSHTA_API_URL
  const API_KEY: string | undefined = process.env.NOVA_POSHTA_API_KEY

  if (!API_URL || !API_KEY) {
    throw new Error(
      'Missing NOVA_POSHTA_API_URL or NOVA_POSHTA_API_KEY in environment variables',
    )
  }

  if (calledMethod === 'getWarehouses' && !methodProperties) {
    throw new Error('Missing object with Page number for getWarehouses method')
  }

  let lastError: unknown

  for (let attempt = 1; attempt <= NOVA_POSHTA_REQUEST_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: API_KEY,
          modelName: 'Address',
          calledMethod,
          methodProperties,
        }),
        cache: 'no-store',
        signal: AbortSignal.timeout(NOVA_POSHTA_REQUEST_TIMEOUT_MS),
      })

      if (!response.ok) {
        throw new Error(
          `Nova Poshta ${calledMethod} returned HTTP ${response.status}`,
        )
      }

      const result: INovaPoshtaApiResponse<T> = await response.json()

      if (!result.success) {
        const details = result.errors?.filter(Boolean).join(', ')
        throw new Error(
          details
            ? `Nova Poshta ${calledMethod} failed: ${details}`
            : `Nova Poshta ${calledMethod} failed`,
        )
      }

      if (!Array.isArray(result.data)) {
        throw new Error(`Nova Poshta ${calledMethod} returned invalid data`)
      }

      return result
    } catch (error) {
      lastError = error

      if (attempt < NOVA_POSHTA_REQUEST_ATTEMPTS) {
        await wait(NOVA_POSHTA_RETRY_DELAY_MS * attempt)
      }
    }
  }

  console.error(
    `Error fetching ${calledMethod} after ${NOVA_POSHTA_REQUEST_ATTEMPTS} attempts: ${getErrorMessage(lastError)}`,
  )

  throw new Error(`Unable to load Nova Poshta ${calledMethod} data`)
}
