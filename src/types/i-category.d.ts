interface ICategory {
  _id: string;
  name: ILocalizedString;
  slug: string;
  description?: ILocalizedString;
  metaTitle?: ILocalizedString;
  metaDescription?: ILocalizedString;
  metaKeywords?: ILocalizedString;
  image?: string;
  children: ICategory[];
  parentCategory?: string;
  order: number;
}

type CategorySlug = Pick<ICategory, "_id" | "slug">;

type CategorySeed = Omit<ICategory, "_id" | "children">;
