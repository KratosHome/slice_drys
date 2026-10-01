export function getProductVariant(
  product: Pick<IProduct, 'variables' | 'variant'>,
  weight?: string | null,
): IVariableProduct {
  return (
    product.variables.find((variable) => String(variable.weight) === weight) ??
    product.variables.find(
      (variable) => variable.weight === product.variant?.weight,
    ) ??
    product.variables[0]
  )
}

export function productVariantUrl(path: string, weight: number): string {
  const [pathname, search = ''] = path.split('?')
  const params = new URLSearchParams(search)
  params.set('weight', String(weight))
  return `${pathname}?${params.toString()}`
}
