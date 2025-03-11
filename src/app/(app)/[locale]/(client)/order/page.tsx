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
import { seedNovaPoshtaDefaultCities } from '@/server/seed/novaPoshtaDefaultCities'
import { getDefaultNPCitiesFromDictionary } from '@/server/delivery/get-cities.server'

export default async function OrderPage() {
  if (process.env.NODE_ENV === 'development') {
    await seedNovaPoshtaDefaultCities()
  }
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
