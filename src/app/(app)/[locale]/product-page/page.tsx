'use client'

import { ProductInfo } from '@/components/client/product-page'
import { Accordions } from '@/components/client/product-page/accordions'
import { Breadcrumbs } from '@/components/client/product-page/breadcrumbs'

export default function ProductPage() {
  return (
    <main className="container px-5 font-poppins lg:px-0">
      <Breadcrumbs />
      <ProductInfo />
      <Accordions />
    </main>
  )
}
