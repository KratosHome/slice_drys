interface IComboboxData {
  value: string;
  label: string;
}

interface IDirectoryCity {
  city: string;
  ref: string;
}

interface IDirectoryBranch {
  branchRef: string;
  branchName: string;
  branchType: string;
}

interface IDirectoryBranches {
  city: string;
  cityRef: string;
  branches: IDirectoryBranch[];
}

interface INovaPoshtaApiCity {
  Ref: string; //id населеного пункту
  SettlementTypeDescription: string; //тип населеного пункту
  Description: string; //назва міста
  AreaDescription: string; //назва області
}

interface INovaPoshtaApiBranch {
  CityDescription: string;
  CityRef: string;
  Description: string;
  Ref: string;
  CategoryOfWarehouse: string;
}

interface INovaPoshtaApiResponse<T> {
  success: boolean;
  data: T;
  info?: { totalCount: number };
}

type IDeliveryMethods = "branch" | "postomat" | "courier";
