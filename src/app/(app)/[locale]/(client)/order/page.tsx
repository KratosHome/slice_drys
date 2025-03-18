import { getTranslations } from 'next-intl/server'
import Order from '@/components/client/order'
import Delivery from '@/components/client/promo-banner/delivery'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/client/ui/breadcrumbs'
import ToTheTop from '@/components/client/ui/to-the-top'
import {
  seedNovaPoshtaCitiesDictionary,
  seedNovaPoshtaDefaultCities,
} from '@/server/seed/novaPoshtaDefaultCities'
import { getDefaultNPCitiesFromDictionary } from '@/server/delivery/get-cities.server'
import { locales } from '@/data/locales'

export async function generateStaticParams() {
  await seedNovaPoshtaDefaultCities()
  await seedNovaPoshtaCitiesDictionary()
  return locales.map((locale) => ({ locale }))
}

export const revalidate = 604800 //7 days
const baseUrl = process.env.NEXT_URL

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

  const canonicalUrl = `${baseUrl}/${locale}/order`

  return {
    title: isUk
      ? 'Оформлення замовлення Slice&Drys'
      : 'Order processing Slice&Drys',
    description: isUk
      ? 'Тут ви можете зручно оформити замовлення на нашому сайті.'
      : 'Here you can easily make an order on our website.',
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${canonicalUrl}`,
        uk: `${canonicalUrl}`,
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

export default async function OrderPage() {
  const t = await getTranslations('Breadcrumbs')
  const defaultCities = await getDefaultNPCitiesFromDictionary()
  return (
    <>
      <div className="mx-auto max-w-[1280px] overflow-hidden px-5">
        <Breadcrumb className="mt-[30px] md:mt-[70px]">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('Home')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('Order')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="title-section title-rubik mt-10 !normal-case md:mt-[66px]">
          {t('Order')}
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
