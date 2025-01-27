'use server'

import { connectToDb } from '@/server/connectToDb'
import { NovaPoshta } from './novaPoshtaSchema'

export async function getNovaPoshtaAllCities() {
  try {
    await connectToDb()
    const citiesObj = await NovaPoshta.find({}, 'city').lean()
    const cities = citiesObj.map((cityObj) => cityObj.city)
    return cities
  } catch (error) {
    console.error('Помилка при отриманні міст Нова Пошта:', error)
    throw error
  }
}

export async function getNovaPoshtaBranchesByCity(city: string) {
  try {
    await connectToDb()
    const branchesObj = await NovaPoshta.find({ city }, 'branches').lean()

    const branches = branchesObj.map((branchObj) => branchObj.branches)
    console.log(111, branches)
    return branches
  } catch (error) {
    console.error(`Помилка при отриманні відділень для міста ${city}:`, error)
    throw error
  }
}
