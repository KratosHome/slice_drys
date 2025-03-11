interface IDirectoryCity {
  city: string
  ref: string
}

interface IDirectoryBranch {
  branchRef: string
  branchName: string
  branchType: string
  // branchType: Capitalize<Omit<IDeliveryMethods, 'courier'>>
}

interface IDirectoryBranches {
  city: string
  cityRef: string
  branches: IDeliveryBranch[]
}

interface INovaPoshtaApiCity {
  Present: string
  DeliveryCity: string
}

interface INovaPoshtaApiBranch {
  CityDescription: string
  CityRef: string
  Description: string
  Ref: string
  CategoryOfWarehouse: string
}

interface INovaPoshtaApiResponse<T> {
  data: T
  info?: { totalCount: number }
}

type IDeliveryMethods = 'branch' | 'postomat' | 'courier'
