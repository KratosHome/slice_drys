import PublicOfferJsonLd from '@/components/client/json-ld/public-offer-json-ld'
import { locales } from '@/data/locales'
import { SITE_URL } from '@/data/contacts'

type Params = Promise<{ locale: ILocale }>

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params
  const isUk = locale === 'uk'
  const title = isUk
    ? "Публічна оферта | Slice & Dry's"
    : "Public Offer | Slice & Dry's"
  const description = isUk
    ? "Ознайомтеся з умовами продажу, оплати, доставки та повернення товарів в інтернет-магазині Slice&Dry's."
    : "Review the terms for purchasing, payment, delivery, and returns in the Slice&Dry's online store."
  const canonicalUrl = `${SITE_URL}/${locale}/public-offer`
  const socialImage = `${SITE_URL}/main.webp`

  return {
    title,
    description,
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
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/public-offer`,
        uk: `${SITE_URL}/uk/public-offer`,
        'x-default': `${SITE_URL}/uk/public-offer`,
      },
    },
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function PublicOffer({ params }: { params: Params }) {
  const { locale } = await params

  let MarkdownToHtml
  try {
    MarkdownToHtml = await import(
      `@/data/public-offer/${locale}-public-offer.mdx`
    )
  } catch (error) {
    throw new Error(`Cannot load public offer for locale: ${locale}`, {
      cause: error,
    })
  }

  return (
    <>
      <PublicOfferJsonLd locale={locale} />
      <div className="prose mx-auto px-4 py-10">
        <article>
          <MarkdownToHtml.default />
        </article>
      </div>
    </>
  )
}
