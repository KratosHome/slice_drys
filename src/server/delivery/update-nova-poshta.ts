'use server'
import { connectToDb } from '@/server/connectToDb'
import { NovaPoshta } from './novaPoshtaSchema'

export async function updateNovaPoshta() {
  try {
    await connectToDb()

    async function fetchCities() {
      const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: '',
          modelName: 'Address',
          calledMethod: 'getCities',
        }),
      })
      const data = await response.json()
      return data.data.map((city: { Description: string; Ref: string }) => ({
        Description: city.Description,
        Ref: city.Ref,
      }))
    }

    const cities = await fetchCities()

    async function fetchBrunchesByPage(i: number) {
      const response = await fetch('https://api.novaposhta.ua/v2.0/json/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: '',
          modelName: 'Address',
          calledMethod: 'getWarehouses',
          methodProperties: {
            Page: i,
          },
        }),
      })
      const data = await response.json()
      return data
    }

    const branchesTotalCount = await fetchBrunchesByPage(1)
    const totalPage = Math.ceil(branchesTotalCount.info.totalCount / 500)

    let combinedBrunchData: {
      Branch: string
      City: string
      CityRef: string
    }[] = []

    for (let i = 1; i <= totalPage; i++) {
      const brunch = await fetchBrunchesByPage(i)
      const brunchData = brunch.data.map(
        (brunch: { Description: string; CityRef: string }) => {
          const city = cities.find(
            (city: { Description: string; Ref: string }) =>
              city.Ref === brunch.CityRef,
          )

          return {
            Branch: brunch.Description,
            City: city ? city.Description : 'Unknown',
            CityRef: city.Ref,
          }
        },
      )

      combinedBrunchData = [...combinedBrunchData, ...brunchData]
    }

    const groupedData = combinedBrunchData.reduce(
      (acc, item) => {
        const existingCity = acc.find((data) => data.cityRef === item.CityRef)
        if (existingCity) {
          existingCity.branches.push(item.Branch)
        } else {
          acc.push({
            cityRef: item.CityRef,
            city: item.City,
            branches: [item.Branch],
          })
        }
        return acc
      },
      [] as { cityRef: string; city: string; branches: string[] }[],
    )

    groupedData.forEach(async (NovaPoshtaData) => {
      await NovaPoshta.updateOne(
        { city: NovaPoshtaData.city },
        { $set: NovaPoshtaData },
        { upsert: true },
      )
    })
    return { success: true, message: 'nova poshta data updated' }
  } catch (error) {
    return {
      success: false,
      message: `Can't update nova poshta data:  ${error}`,
    }
  }
}
