interface FilterOperators {
  $in?: string[];
  $gte?: number;
  $lte?: number;
}

type IQueryType = Record<string, FilterOperators>;
