import { getTranslations } from 'next-intl/server'
import Contacts from '@/components/client/contacts/contacts'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumbs'
import ContactsJsonLd from '@/components/client/json-ld/contacts-json-ld'
import JoinCommunity from '@/components/client/promo-banner/join-community'
import ToTheTop from '@/components/ui/to-the-top'
import { locales } from '@/data/locales'
import { SITE_URL } from '@/data/contacts'

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params
  const isUk = locale === 'uk'

  const keywords = isUk
    ? ['контакти', 'запитання', 'замовлення', 'звʼязок', 'slice&drys']
    : ['contacts', 'questions', 'orders', 'communication', 'slice&drys']

  const canonicalUrl = `${SITE_URL}/${locale}/contacts`
  const title = isUk ? "Контакти Slice & Dry's" : "Contacts | Slice & Dry's"
  const description = isUk
    ? "Телефон, email та адреса Slice&Dry's у Черкасах. Звертайтеся щодо замовлень, доставки, оптової співпраці або запитань про натуральні сушені снеки."
    : "Find the phone, email and address of Slice&Dry's in Cherkasy. Contact us about orders, delivery, wholesale partnerships or our natural dried snacks."
  const socialImage = `${SITE_URL}/main.webp`

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/contacts`,
        uk: `${SITE_URL}/uk/contacts`,
        'x-default': `${SITE_URL}/uk/contacts`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: "Slice & Dry's",
      locale: isUk ? 'uk_UA' : 'en_US',
      images: [{ url: socialImage, width: 1005, height: 895, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ContactsPage(props: { params: Params }) {
  const { locale } = await props.params
  const t = await getTranslations('breadcrumbs')

  return (
    <>
      <ContactsJsonLd locale={locale} />
      <div className="mx-auto max-w-[1280px] overflow-hidden p-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`}>{t('home')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('contacts')}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Contacts />
        <JoinCommunity className="my-[70px] mb-[100px] md:mt-[120px]" />
        <ToTheTop />
      </div>
    </>
  )
}
