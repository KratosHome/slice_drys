'use server'

import { connectToDb } from '@/server/connectToDb'
import { NovaPoshtaBranches } from './novaPoshtaSchema'
import { getNovaPoshtaApiData } from './get-np-api-data.server'

export async function getNPBranchesByCityRef(
  cityRef: string,
): Promise<IDirectoryBranch[] | null> {
  const branches = await getNPBranchesByCityRefFromDirectory(cityRef)
  console.log('branches: ', branches ? '' : branches)

  if (!branches) {
    const resp = await getNPBranchesByCityRefOnline(cityRef)
    console.log('online branches: ', resp ? resp.slice(0, 5) : resp)
    if (!resp?.length) return null
    const newBranches = {
      cityRef: resp[0].cityRef,
      city: resp[0].city,
      branches: resp.map(({ branchRef, branchName, branchType }) => ({
        branchRef,
        branchName,
        branchType,
      })),
    }
    console.log(
      'newBranches: ',
      newBranches
        ? { ...newBranches, branches: newBranches.branches.slice(0, 5) }
        : newBranches,
    )
    try {
      connectToDb()
      const res = (await NovaPoshtaBranches.create(newBranches)).toObject()
      console.log('branches from DB', {
        ...res,
        branches: res.branches.slice(0, 5),
      })
      return res.branches
    } catch (error) {
      console.error('Помилка при доданні відділень Нова Пошта:', error)
      return null
    }
  }

  return branches
}

export async function getNPBranchesByCityRefOnline(cityRef: string): Promise<
  | (IDirectoryBranch & {
      city: string
      cityRef: string
    })[]
  | null
> {
  try {
    const branches = await getNovaPoshtaApiData<INovaPoshtaApiBranch[]>(
      'getWarehouses',
      {
        CityRef: cityRef,
      },
    )
    return branches.data.map((branch) => ({
      cityRef: branch.CityRef,
      city: branch.CityDescription,
      branchRef: branch.Ref,
      branchName: branch.Description,
      branchType: branch.CategoryOfWarehouse,
    }))
  } catch (error) {
    console.error('Помилка при отриманні відділень Нова Пошта з API:', error)

    return null
  }
}

export async function getNPBranchesByCityRefFromDirectory(
  cityRef: string,
): Promise<IDirectoryBranch[] | null> {
  try {
    await connectToDb()

    const data = await NovaPoshtaBranches.findOne({
      cityRef,
    }).lean<IDirectoryBranches>()
    // console.log(data)
    return data ? data?.branches : null
  } catch (error) {
    console.error(`Помилка при отриманні відділень для міста:`, error)

    return null
  }
}

// export async function getNovaPoshtaAllCities(): Promise<string[]> {
//   try {
//     await connectToDb()

//     const citiesObj = await NovaPoshta.find({}, 'city').lean()
//     const cities: string[] = citiesObj.map((cityObj) => cityObj.city)

//     return cities
//   } catch (error) {
//     console.error('Помилка при отриманні міст Нова Пошта:', error)

//     throw error
//   }
// }
