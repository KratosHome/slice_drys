'use server'

import { connectToDb } from '@/server/connectToDb'
import { NovaPoshtaCities, NovaPoshtaDefaultCities } from './novaPoshtaSchema'
import { getNovaPoshtaApiData } from './get-np-api-data.server'

export async function getDefaultNPCitiesFromDictionary() {
  'use server'
  try {
    await connectToDb()
    const cities = await NovaPoshtaDefaultCities.find({}).lean<
      IDirectoryCity[]
    >()

    return cities.map(({ city, ref }) => ({
      city,
      ref,
    }))
  } catch (error) {
    console.error('Помилка при отриманні міст Нова Пошта:', error)

    return null
  }
}

export async function getNPCitiesFromDictionary(city: string) {
  try {
    await connectToDb()
    const cities = await NovaPoshtaCities.find({
      city: { $regex: city, $options: 'i' },
    }).lean<IDirectoryCity[]>()
    return cities.map(({ city, ref }) => ({
      city,
      ref,
    }))
  } catch (error) {
    console.error('Помилка при отриманні міст Нова Пошта:', error)

    return null
  }
}

export async function getNPCityOnline(): Promise<INovaPoshtaApiResponse<
  INovaPoshtaApiCity[]
> | null> {
  try {
    const result = await getNovaPoshtaApiData<INovaPoshtaApiCity[]>('getCities')
    return result
  } catch (error) {
    console.error('Помилка при отриманні міст Нова Пошта з API:', error)
    return null
  }
}
