'use server'

import { NovaPoshtaBranches } from './nova-poshta-schema.server'

import { connectToDbServer } from '@/server/connect-to-db.server'
import { getNovaPoshtaApiData } from './get-np-api-data.server'

export async function getNPBranchesByCityRef(
  cityRef: string,
): Promise<IDirectoryBranch[] | null> {
  const branches: IDirectoryBranch[] | null =
    await getNPBranchesByCityRefFromDirectory(cityRef)

  if (!branches) {
    const resp = await getNPBranchesByCityRefOnline(cityRef)

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

    try {
      connectToDbServer()

      const res = (await NovaPoshtaBranches.create(newBranches)).toObject()
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
    await connectToDbServer()

    const data = await NovaPoshtaBranches.findOne({
      cityRef,
    }).lean<IDirectoryBranches>()
    return data ? data?.branches : null
  } catch (error) {
    console.error(`Помилка при отриманні відділень для міста:`, error)
    return null
  }
}
