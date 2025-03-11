'use server'

interface INovaPoshtaApiResponse<T> {
  data: T
  info?: { totalCount: number }
}

export async function getNovaPoshtaApiData<T>(
  calledMethod: 'getCities' | 'getWarehouses',
  methodProperties?: Record<string, unknown>,
): Promise<INovaPoshtaApiResponse<T>> {
  const API_URL: string | undefined = process.env.NOVA_POSHTA_API_URL
  const API_KEY: string | undefined = process.env.NOVA_POSHTA_API_KEY

  if (!API_URL || !API_KEY) {
    throw new Error(
      'Missing NOVA_POSHTA_API_URL or NOVA_POSHTA_API_KEY in environment variables',
    )
  }

  if (calledMethod === 'getWarehouses' && !methodProperties) {
    throw new Error('Missing object with Page number for getWarehouses method')
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: API_KEY,
        modelName: 'Address',
        calledMethod,
        methodProperties,
      }),
    })

    if (!response.ok) throw new Error(`Failed to fetch ${calledMethod}`)

    const result: INovaPoshtaApiResponse<T> = await response.json()

    return result
  } catch (error) {
    console.error(`Error fetching ${calledMethod}:`, error)

    throw error
  }
}

// export async function updateNovaPoshta(): Promise<IResponse> {
//   try {
//     await connectToDb()

//     const cities = await fetchNovaPoshtaData<ICity[]>('getCities')

//     if (!cities) throw new Error('Failed to fetch initial cities data')

//     const firstPageBranches = await fetchNovaPoshtaData<IBranch[]>(
//       'getWarehouses',
//       { Page: 1 },
//     )

//     if (!firstPageBranches) {
//       throw new Error('Failed to fetch initial branches data')
//     }

//     const totalPages: number = Math.ceil(
//       (firstPageBranches.info?.totalCount || 0) / 500,
//     )

//     const branchPages = await Promise.all(
//       Array.from({ length: totalPages }, (_, i) =>
//         fetchNovaPoshtaData<IBranch[]>('getWarehouses', {
//           Page: i + 1,
//         }),
//       ),
//     )

//     const combinedBranches: ICombinedBranch[] = branchPages
//       .filter(Boolean)
//       .flatMap((branchesPage) =>
//         branchesPage!.data.map(({ Description, CityRef }) => {
//           const city: ICity | undefined = cities.data.find(
//             (city) => city.Ref === CityRef,
//           )

//           return {
//             Branch: Description,
//             City: city ? city.Description : 'Unknown city',
//             CityRef: city?.Ref || 'Unknown city reference',
//           }
//         }),
//       )

//     const groupedBranchesByCity = combinedBranches.reduce<
//       IGroupedBranchesByCity[]
//     >((acc, { Branch, City, CityRef }) => {
//       const existingCity: IGroupedBranchesByCity | undefined = acc.find(
//         (data) => data.cityRef === CityRef,
//       )

//       if (existingCity) {
//         existingCity.branches.push(Branch)
//       } else {
//         acc.push({
//           cityRef: CityRef,
//           city: City,
//           branches: [Branch],
//         })
//       }

//       return acc
//     }, [])

//     await Promise.all(
//       groupedBranchesByCity.map((branchesByCity) =>
//         NovaPoshta.updateOne(
//           { city: branchesByCity.city },
//           { $set: branchesByCity },
//           { upsert: true },
//         ),
//       ),
//     )

//     return { success: true, message: 'Nova poshta data updated' }
//   } catch (error) {
//     return {
//       success: false,
//       message: `Can't update nova poshta data:  ${error}`,
//     }
//   }
// }
