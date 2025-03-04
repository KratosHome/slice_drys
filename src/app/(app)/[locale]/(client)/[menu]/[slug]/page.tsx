import { ProductInfo } from '@/components/client/product-page'
import { Accordions } from '@/components/client/product-page/accordions'
import { Breadcrumbs } from '@/components/client/product-page/breadcrumbs'
import NotFoundPage from '@/components/not-found'
import ProductSlider from '@/components/client/product-slider/product-slider'
import { getTranslations } from 'next-intl/server'
import Delivery from '@/components/client/promo-banner/delivery'
import ToTheTop from '@/components/client/ui/to-the-top'

type Params = Promise<{ locale: ILocale; slug: string }>
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: {
  params: Params
  searchParams: SearchParams
}) {
  const url = process.env.NEXT_URL
  const { slug, locale } = await props.params

  const t = await getTranslations('product')

  const [productData, productSliderData] = await Promise.all([
    fetch(`${url}/api/products/get-by-slug?&slug=${slug}&locale=${locale}`, {
      next: { revalidate: 60 },
    }).then((res) => res.json()),

    fetch(
      `${url}/api/products/get-products-slider-main?&locale=${locale}&categories=${locale}&productId=${locale}`,
      {},
    ).then((res) => res.json()),
  ])

  if (productData.success === false) {
    return <NotFoundPage />
  }

  console.log('productSliderData.data', productSliderData)

  return (
    <div className="container px-5">
      <Breadcrumbs
        locale={locale}
        category={productData.data.categories[0].name}
        product={productData.data.name}
        categoryLink={productData.data.categories[0].slug}
      />
      <ProductInfo product={productData.data} />
      <Accordions nutritions={productData.data.nutritionalValue} />
      <ProductSlider products={[]} title={t('title')} message={t('message')} />
      <Delivery />
      <ToTheTop />
    </div>
  )
}
