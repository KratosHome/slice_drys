'use server'

import { connectToDb } from '@/server/connectToDb'
import { NovaPoshta } from './novaPoshtaSchema'

export async function getNovaPoshtaAllCities(): Promise<string[]> {
  try {
    await connectToDb()

    const citiesObj = await NovaPoshta.find({}, 'city').lean()
    const cities: string[] = citiesObj.map((cityObj) => cityObj.city)

    return cities
  } catch (error) {
    console.error('Помилка при отриманні міст Нова Пошта:', error)

    throw error
  }
}

export async function getNovaPoshtaBranchesByCity(
  city: string,
): Promise<string[][]> {
  try {
    await connectToDb()

    const branchesObj = await NovaPoshta.find({ city }, 'branches').lean()
    const branches: string[][] = branchesObj.map(
      (branchObj) => branchObj.branches,
    )

    return branches
  } catch (error) {
    console.error(`Помилка при отриманні відділень для міста ${city}:`, error)

    throw error
  }
}
