import { getTranslations } from 'next-intl/server'
import Contacts from '@/components/client/contacts/Contacts'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumbs'
import ContactsJsonLd from '@/components/client/json-ld/contacts-json-ld'
import JoinCommunity from '@/components/client/promo-banner/JoinCommunity'
import ToTheTop from '@/components/ui/to-the-top'
import { locales } from '@/data/locales'

const baseUrl = process.env.NEXT_URL

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params
  const isUk = locale === 'uk'

  const keywords = isUk
    ? ['контакти', 'запитання', 'замовлення', 'звʼязок', 'slice&drys']
    : ['contacts', 'questions', 'orders', 'communication', 'slice&drys']

  const canonicalUrl = `${baseUrl}/${locale}/contacts`

  return {
    title: isUk ? 'Контакти Slice&Drys' : 'Contacts Slice&Drys',
    description: isUk
      ? 'Звʼяжіться з нами для запитань, замовлень чи співпраці.'
      : 'Contact us for inquiries, orders, or cooperation.',
    keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${canonicalUrl}`,
        uk: `${canonicalUrl}`,
      },
    },
    openGraph: {
      title: isUk ? 'Контакти' : 'Contacts',
      description: isUk
        ? 'Звʼяжіться з нами для запитань, замовлень чи співпраці.'
        : 'Contact us for inquiries, orders, or cooperation.',
      url: `${canonicalUrl}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: isUk ? 'Контакти' : 'Contacts',
      description: isUk
        ? 'Звʼяжіться з нами для запитань, замовлень чи співпраці.'
        : 'Contact us for inquiries, orders, or cooperation.',
    },
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ContactsPage(props: { params: Params }) {
  const { locale } = await props.params
  const t = await getTranslations('Breadcrumbs')

  return (
    <>
      <ContactsJsonLd locale={locale} />
      <div className="mx-auto max-w-[1280px] overflow-hidden p-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('Home')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('Contacts')}</BreadcrumbPage>
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
