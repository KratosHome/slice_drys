const toCardVariant = (variable: IVariableProduct): IVariableProduct => ({
  _id: variable._id,
  weight: variable.weight,
  price: variable.price,
  ...(variable.newPrice !== undefined ? { newPrice: variable.newPrice } : {}),
  currency: variable.currency,
  count: variable.count,
})

export function toProductCard(product: IProduct): IProductCard {
  return {
    _id: product._id,
    name: product.name,
    img: product.img,
    slug: product.slug,
    category: product.category,
    statusLabel: product.statusLabel,
    variables: product.variables.map(toCardVariant),
    ...(product.variant ? { variant: toCardVariant(product.variant) } : {}),
  }
}
