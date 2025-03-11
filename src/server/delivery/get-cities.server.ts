'use server'

import { connectToDb } from '@/server/connectToDb'
import { NovaPoshtaCities } from './novaPoshtaSchema'
import { getNovaPoshtaApiData } from './get-np-api-data.server'

export async function getDefaultNPCitiesFromDictionary() {
  try {
    await connectToDb()
    const cities = await NovaPoshtaCities.find({}).lean<IDirectoryCity[]>()

    return cities.map(({ city, ref }) => ({
      city,
      ref,
    }))
  } catch (error) {
    console.error('Помилка при отриманні міст Нова Пошта:', error)

    return null
  }
}

export async function getNPCityOnline(
  city: string,
): Promise<INovaPoshtaApiResponse<{
  Addresses: INovaPoshtaApiCity[]
}> | null> {
  try {
    const result = await getNovaPoshtaApiData<{
      Addresses: INovaPoshtaApiCity[]
    }>('getCities', {
      FindByString: city,
    })

    return result
  } catch (error) {
    console.error('Помилка при отриманні міст Нова Пошта з API:', error)

    return null
  }
}
