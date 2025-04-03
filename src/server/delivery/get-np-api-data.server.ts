'use server'

export async function getNovaPoshtaApiData<T>(
  calledMethod: 'getCities' | 'getWarehouses',
  methodProperties?: Record<string, unknown>,
): Promise<INovaPoshtaApiResponse<T>> {
  'use server'
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
    })

    if (!response.ok) throw new Error(`Failed to fetch ${calledMethod}`)

    const result: INovaPoshtaApiResponse<T> = await response.json()

    return result
  } catch (error) {
    console.error(`Error fetching ${calledMethod}:`, error)

    throw error
  }
}
