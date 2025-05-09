import InstaFeed from '@/components/client/main/instaFeed/Insta-feed'
import { instaData } from '@/data/main/insta-data'
import ToTheTop from '@/components/ui/to-the-top'
import Help from '@/components/client/main/help/help'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumbs'
import { getTranslations } from 'next-intl/server'
import WholesaleForm from '@/components/client/wholesale/wholesale-form'
import { helpData } from '@/data/wholesale-about'
import { whyWe } from '@/data/wholesale-why-wr'
import WholesaleJsonLd from '@/components/client/json-ld/wholesale-json-ld'
import { locales } from '@/data/locales'

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

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
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
        <h1 className="font-rubik mt-[40px] mb-[66px] text-center text-[40px] leading-[38px] lg:mt-[66px] lg:text-[98px] lg:leading-[88px]">
          {t('wholesale_dried_fruits_in_bulk')}
        </h1>
        <div className="flex justify-center">
          <div className="bg-foreground text-background min-h-28 w-[100%] max-w-[790px] items-center justify-center px-10 py-5 text-left text-[20px] leading-[28px] drop-shadow-[16px_-16px_0px_#A90909]">
            {t('do_you_have_business')}
          </div>
        </div>
        <div className="font-rubik mt-[77px] text-center text-[32px] lg:mt-[130px] lg:text-[64px]">
          {t('why_us')}
        </div>
        <div className="mt-[71px] grid grid-cols-1 gap-[29px] md:grid-cols-3">
          {whyWe[locale].map((item) => (
            <div key={item.title} className="w-full">
              <div className="font-rubik bg-foreground text-background w-full p-[16px] text-center text-[24px] lg:text-[32px]">
                {item.title}
              </div>
              <div className="border-foreground w-full border border-dashed p-[14px] text-center text-[16px] lg:text-[18px]">
                {item.content}
              </div>
            </div>
          ))}
        </div>
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
