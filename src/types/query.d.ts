interface FilterOperators {
  $in?: string[]
}

type IQueryType = Record<string, FilterOperators>
