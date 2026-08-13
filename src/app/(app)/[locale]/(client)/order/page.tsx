import { getTranslations } from 'next-intl/server'
import Order from '@/components/client/order/order'
import Delivery from '@/components/client/promo-banner/delivery'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumbs'
import ToTheTop from '@/components/ui/to-the-top'
import { getDefaultNPCitiesFromDictionary } from '@/server/delivery/get-cities.server'
import { locales } from '@/data/locales'
import { SITE_URL } from '@/data/contacts'

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const revalidate = 604800 //7 days

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params
  const isUk = locale === 'uk'

  const keywords = isUk
    ? [
        'оформлення замовлення',
        'доставка сушеників',
        'оплата сушеників',
        'нова пошта',
        'сушеники',
        'сушені продукти',
        'замовлення сушеників',
        'способи доставки',
        'способи оплати',
        'slice&drys',
      ]
    : [
        'order checkout',
        'delivery of dry snacks',
        'payment for dry snacks',
        'nova poshta',
        'dry snacks',
        'dried products',
        'dry snacks order',
        'delivery options',
        'payment methods',
        'slice&drys',
      ]

  const canonicalUrl = `${SITE_URL}/${locale}/order`

  return {
    title: isUk
      ? "Оформлення замовлення | Slice & Dry's"
      : "Order processing | Slice & Dry's",
    description: isUk
      ? 'Тут ви можете зручно оформити замовлення на нашому сайті.'
      : 'Here you can easily make an order on our website.',
    keywords,
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/order`,
        uk: `${SITE_URL}/uk/order`,
        'x-default': `${SITE_URL}/uk/order`,
      },
    },
    openGraph: {
      title: isUk ? 'Оформлення замовлення' : 'Order processing',
      description: isUk
        ? 'Тут ви можете зручно оформити замовлення на нашому сайті.'
        : 'Here you can easily make an order on our website.',
      url: `${canonicalUrl}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: isUk ? 'Оформлення замовлення' : 'Order processing',
      description: isUk
        ? 'Тут ви можете зручно оформити замовлення на нашому сайті.'
        : 'Here you can easily make an order on our website.',
    },
  }
}

export default async function OrderPage({ params }: { params: Params }) {
  const { locale } = await params
  const t = await getTranslations('breadcrumbs')
  const defaultCities = await getDefaultNPCitiesFromDictionary()
  return (
    <>
      <div className="mx-auto max-w-[1280px] overflow-hidden px-5">
        <Breadcrumb className="mt-[30px] md:mt-[70px]">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`}>{t('home')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('order')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="title-section title-rubik mt-10 normal-case! md:mt-[66px]">
          {t('order')}
        </h1>
        <Order
          defaultCities={{
            novaPoshta: defaultCities || [],
          }}
        />
      </div>
      <Delivery className="my-[150px] mb-[100px] md:mt-[250px]" />
      <ToTheTop />
    </>
  )
}
