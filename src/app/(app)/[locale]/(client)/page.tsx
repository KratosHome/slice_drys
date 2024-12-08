'use client'
import { Hero } from '@/components/client/hero/hero'
import ProductSlider from '@/components/client/slider/productSlider'
import { productsList } from '@/data/products-list'

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductSlider products={productsList} />
    </main>
  )
}
