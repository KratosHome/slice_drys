import PrivacyPolicyJsonLd from '@/components/client/json-ld/privacy-policy-json-ld'
import { locales } from '@/data/locales'
import { SITE_URL } from '@/data/contacts'

type Params = Promise<{ locale: ILocale }>

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params
  const isUk = locale === 'uk'
  const title = isUk
    ? "Політика конфіденційності | Slice & Dry's"
    : "Privacy Policy | Slice & Dry's"
  const description = isUk
    ? "Дізнайтеся, як Slice&Dry's збирає, використовує та захищає персональні дані користувачів під час оформлення замовлень і користування сайтом."
    : "Learn how Slice&Dry's collects, uses, and protects personal data when you browse the website or place an order."
  const canonicalUrl = `${SITE_URL}/${locale}/privacy-policy`
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
        en: `${SITE_URL}/en/privacy-policy`,
        uk: `${SITE_URL}/uk/privacy-policy`,
        'x-default': `${SITE_URL}/uk/privacy-policy`,
      },
    },
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function PrivacyPolicy({ params }: { params: Params }) {
  const { locale } = await params

  let MarkdownToHtml
  try {
    MarkdownToHtml = await import(
      `@/data/privacy-policy/${locale}-privacy-policy.mdx`
    )
  } catch (error) {
    throw new Error(`Cannot load privacy policy for locale: ${locale}`, {
      cause: error,
    })
  }

  return (
    <>
      <PrivacyPolicyJsonLd locale={locale} />
      <div className="prose mx-auto px-4 py-10">
        <article>
          <MarkdownToHtml.default />
        </article>
      </div>
    </>
  )
}
