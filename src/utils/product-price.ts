type ProductPrice = {
  price: number
  newPrice?: number | null
}

export function getProductPrice(variable: ProductPrice): number | undefined {
  for (const price of [variable.newPrice, variable.price]) {
    if (typeof price === 'number' && Number.isFinite(price) && price > 0) {
      return Math.round((price + Number.EPSILON) * 100) / 100
    }
  }

  return undefined
}

export function isProductPriceReduced(variable: ProductPrice): boolean {
  const price = getProductPrice(variable)
  return price !== undefined && price < variable.price
}
