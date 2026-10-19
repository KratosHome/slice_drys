'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { getProductVariant } from '@/utils/product-variant'

const ProductVariantContext = createContext<IVariableProduct | null>(null)

export function ProductVariantProvider({
  product,
  children,
}: {
  product: Pick<IProduct, 'variables' | 'variant'>
  children: ReactNode
}) {
  const searchParams = useSearchParams()
  const selectedVariable = getProductVariant(
    product,
    searchParams.get('weight'),
  )

  return (
    <ProductVariantContext.Provider value={selectedVariable}>
      {children}
    </ProductVariantContext.Provider>
  )
}

export function useProductVariant() {
  const variant = useContext(ProductVariantContext)
  if (!variant) throw new Error('ProductVariantProvider is required')
  return variant
}
