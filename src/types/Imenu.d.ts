interface IMenu {
  _id: string
  name: ILocalizedString
  slug: string
  categories: Types.ObjectId[]
}
