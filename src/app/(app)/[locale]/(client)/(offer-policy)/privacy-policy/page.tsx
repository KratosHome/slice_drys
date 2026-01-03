import PrivacyPolicyJsonLd from '@/components/client/json-ld/privacy-policy-json-ld'
import { locales } from '@/data/locales'
import { SITE_URL } from '@/data/contacts'

type Params = Promise<{ locale: ILocale }>

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params
  const isUk = locale === 'uk'

  return {
    title: isUk ? 'Політика конфіденційності' : 'Privacy Policy',
    description: isUk
      ? 'Умови політики конфіденційності'
      : 'Privacy policy details',
    openGraph: {
      title: isUk ? 'Політика конфіденційності' : 'Privacy Policy',
      description: isUk
        ? 'Умови політики конфіденційності'
        : 'Privacy policy details',
      url: `${SITE_URL}/${locale}/privacy-policy`,
    },
    twitter: {
      card: 'summary_large_image',
      title: isUk ? 'Політика конфіденційності' : 'Privacy Policy',
      description: isUk
        ? 'Умови політики конфіденційності'
        : 'Privacy policy details',
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}/privacy-policy`,
      languages: {
        en: `${SITE_URL}/${locale}/privacy-policy`,
        uk: `${SITE_URL}/${locale}/privacy-policy`,
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
    console.error(`Cannot load privacy policy for locale: ${locale}`, error)
    return <div>Error loading privacy policy content</div>
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
