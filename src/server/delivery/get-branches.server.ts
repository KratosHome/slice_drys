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
    if (!branches.success) return []
    return branches.data.map((branch) => ({
      cityRef: branch.CityRef,
      city: branch.CityDescription,
      branchRef: branch.Ref,
      branchName: branch.Description,
      branchType: !branch.CategoryOfWarehouse.toLowerCase().includes('postomat')
        ? 'Branch'
        : branch.CategoryOfWarehouse,
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

// {
// 	"success": true,
// 	"data": [
// 		{
// 			"Ref": "6f8c7162-4b72-4b0a-88e5-906948c6a92f",
// 			"Description": "Поштове відділення з обмеження",
// 			"DescriptionRu": "Parcel Shop"                    Store
// 		},
// 		{
// 			"Ref": "841339c7-591a-42e2-8233-7a0a00f0ed6f",   Branch
// 			"Description": "Поштове(ий)",
// 			"DescriptionRu": "Почтовое отделение"
// 		},
// 		{
// 			"Ref": "95dc212d-479c-4ffb-a8ab-8c1b9073d0bc",
// 			"Description": "Поштомат ПриватБанку",
// 			"DescriptionRu": "Почтомат приват банка"
// 		},
// 		{
// 			"Ref": "9a68df70-0267-42a8-bb5c-37f427e36ee4", Branch
// 			"Description": "Вантажне(ий)",
// 			"DescriptionRu": "Грузовое отделение"
// 		},
// 		{
// 			"Ref": "f9316480-5f2d-425d-bc2c-ac7cd29decf0",    Postomat
// 			"Description": "Поштомат",
// 			"DescriptionRu": "Почтомат"
// 		}
// 	],
// 	"errors": [],
// 	"warnings": [],
// 	"info": [],
// 	"messageCodes": [],
// 	"errorCodes": [],
// 	"warningCodes": [],
// 	"infoCodes": []
// }
