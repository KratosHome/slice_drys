import InstaFeed from '@/components/client/main/instaFeed/InstaFeed'
import { instaData } from '@/data/main/insta-data'
import ToTheTop from '@/components/client/ui/to-the-top'
import Help from '@/components/client/main/help/help'
import Partners from '@/components/client/main/partners'
import { partnersData } from '@/data/main/partners'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/client/ui/breadcrumbs'
import { getTranslations } from 'next-intl/server'
import WholesaleForm from '@/components/client/wholesale/wholesale-form'
import { helpData } from '@/data/wholesale-about'
import { whyWe } from '@/data/wholesale-why-wr'
import WholesaleJsonLd from '@/components/client/json-ld/wholesale-json-ld'

const baseUrl = process.env.NEXT_URL

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params
  const isUk = locale === 'uk'

  const keywords = isUk
    ? ['сушеники', 'опт', 'сушені продукти', 'закупівлі', 'slice&drys']
    : ['dried', 'wholesale', 'dried products', 'bulk', 'slice&drys']

  const canonicalUrl = `${baseUrl}/${locale}/wholesale`

  return {
    title: isUk ? 'Оптові закупівлі' : 'Wholesale',
    description: isUk
      ? 'Сторінка оптових закупівель наших сушеників'
      : 'Our wholesale page for dried products',
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${canonicalUrl}`,
        uk: `${canonicalUrl}`,
      },
    },
    openGraph: {
      title: isUk ? 'Оптові закупівлі' : 'Wholesale',
      description: isUk
        ? 'Сторінка оптових закупівель наших сушеників'
        : 'Our wholesale page for dried products',
      url: `${canonicalUrl}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: isUk ? 'Оптові закупівлі' : 'Wholesale',
      description: isUk
        ? 'Сторінка оптових закупівель наших сушеників'
        : 'Our wholesale page for dried products',
    },
  }
}

export default async function Wholesale(props: { params: Params }) {
  const { locale } = await props.params
  const t = await getTranslations('wholesale')

  return (
    <>
      <WholesaleJsonLd locale={locale} />
      <div className="relative mx-auto max-w-[1280px] px-4">
        <Breadcrumb className={'mt-5'}>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('home')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('wholesale')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="mb-[66px] mt-[40px] text-center font-rubik text-[40px] leading-[38px] lg:mt-[66px] lg:text-[98px] lg:leading-[88px]">
          {t('wholesale_dried_fruits_in_bulk')}
        </h1>
        <div className="flex justify-center">
          <div className="min-h-28 w-[100%] max-w-[790px] items-center justify-center bg-black px-10 py-5 text-left font-poppins text-[20px] leading-[28px] text-white drop-shadow-[16px_-16px_0px_#A90909]">
            {t('do_you_have_business')}
          </div>
        </div>
        <div className="mt-[77px] text-center font-rubik text-[32px] lg:mt-[130px] lg:text-[64px]">
          {t('why_us')}
        </div>
        <div className="mt-[71px] grid grid-cols-1 gap-[29px] md:grid-cols-3">
          {whyWe[locale].map((item) => (
            <div key={item.title} className="w-full">
              <div className="w-full bg-black p-[16px] text-center font-rubik text-[24px] text-white lg:text-[32px]">
                {item.title}
              </div>
              <div className="w-full border border-dashed border-black p-[14px] text-center text-[16px] lg:text-[18px]">
                {item.content}
              </div>
            </div>
          ))}
        </div>
        <Partners data={partnersData[locale]} />
      </div>
      <Help data={helpData[locale]} />
      <div className="relative mx-auto max-w-[1280px] px-4">
        <WholesaleForm />
        <InstaFeed title={t('join_us')} data={instaData[locale]} />
        <ToTheTop />
      </div>
    </>
  )
}
