'use server'

import { after } from 'next/server'
import { NovaPoshtaBranches } from './nova-poshta-schema.server'

import { connectToDbServer } from '@/server/connect-to-db.server'
import { getNovaPoshtaApiData } from './get-np-api-data.server'

const BRANCH_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1_000
const BRANCH_CACHE_READ_TIMEOUT_MS = 5_000
const CITY_REF_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

interface ICachedDirectoryBranches extends IDirectoryBranches {
  updatedAt?: Date
}

const pendingBranchRequests = new Map<string, Promise<IDirectoryBranch[]>>()

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error(message)), timeoutMs)

    promise.then(
      (value) => {
        clearTimeout(timeoutId)
        resolve(value)
      },
      (error: unknown) => {
        clearTimeout(timeoutId)
        reject(error)
      },
    )
  })
}

export async function getNPBranchesByCityRef(
  cityRef: string,
): Promise<IDirectoryBranch[]> {
  if (!CITY_REF_PATTERN.test(cityRef)) {
    throw new Error('Invalid Nova Poshta city reference')
  }

  const pendingRequest = pendingBranchRequests.get(cityRef)
  if (pendingRequest) return pendingRequest

  const request = loadNPBranchesByCityRef(cityRef).finally(() => {
    pendingBranchRequests.delete(cityRef)
  })

  pendingBranchRequests.set(cityRef, request)
  return request
}

async function loadNPBranchesByCityRef(
  cityRef: string,
): Promise<IDirectoryBranch[]> {
  const cachedDirectory = await getNPBranchesByCityRefFromDirectory(cityRef)
  const cachedBranches = cachedDirectory?.branches ?? []
  const cacheUpdatedAt = cachedDirectory?.updatedAt?.getTime() ?? 0
  const isCacheFresh =
    cachedBranches.length > 0 &&
    Date.now() - cacheUpdatedAt < BRANCH_CACHE_MAX_AGE_MS

  if (isCacheFresh) return cachedBranches

  try {
    const onlineBranches = await getNPBranchesByCityRefOnline(cityRef)

    if (!onlineBranches.length) return cachedBranches

    const directory = {
      cityRef: onlineBranches[0].cityRef,
      city: onlineBranches[0].city,
      branches: onlineBranches.map(({ branchRef, branchName, branchType }) => ({
        branchRef,
        branchName,
        branchType,
      })),
    }

    // The customer must not wait for a cache write, and a cache failure must
    // never discard valid data received from Nova Poshta.
    after(() => saveNPBranchesToDirectory(directory))

    return directory.branches
  } catch (error) {
    if (cachedBranches.length) {
      console.warn(
        'Не вдалося оновити відділення Нова Пошта; використано кеш:',
        error,
      )
      return cachedBranches
    }

    throw error
  }
}

async function getNPBranchesByCityRefOnline(cityRef: string): Promise<
  (IDirectoryBranch & {
    city: string
    cityRef: string
  })[]
> {
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
    branchType: !branch.CategoryOfWarehouse.toLowerCase().includes('postomat')
      ? 'Branch'
      : branch.CategoryOfWarehouse,
  }))
}

async function getNPBranchesByCityRefFromDirectory(
  cityRef: string,
): Promise<ICachedDirectoryBranches | null> {
  try {
    const data = await withTimeout(
      (async () => {
        await connectToDbServer()

        return NovaPoshtaBranches.findOne({
          cityRef,
        }).lean<ICachedDirectoryBranches>()
      })(),
      BRANCH_CACHE_READ_TIMEOUT_MS,
      'Nova Poshta branch cache read timed out',
    )

    return data ?? null
  } catch (error) {
    console.error(`Помилка при отриманні відділень для міста:`, error)
    return null
  }
}

async function saveNPBranchesToDirectory(
  directory: IDirectoryBranches,
): Promise<void> {
  try {
    await connectToDbServer()
    await NovaPoshtaBranches.findOneAndUpdate(
      { cityRef: directory.cityRef },
      { $set: directory },
      { upsert: true, setDefaultsOnInsert: true },
    )
  } catch (error) {
    console.error('Помилка при оновленні відділень Нова Пошта:', error)
  }
}
