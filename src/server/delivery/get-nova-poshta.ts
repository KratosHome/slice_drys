'use server'

import { connectToDb } from '@/server/connectToDb'
import { NovaPoshta } from './novaPoshtaSchema'

export async function getNovaPoshtaAllCities() {
  try {
    await connectToDb()
    const citiesObj = await NovaPoshta.find({}, 'city').lean()
    const cities = citiesObj.map((cityObj) => cityObj.city)
    console.log(cities)
    return cities
  } catch (error) {
    console.error('Помилка при отриманні міст Нова Пошта:', error)
    throw error
  }
}
