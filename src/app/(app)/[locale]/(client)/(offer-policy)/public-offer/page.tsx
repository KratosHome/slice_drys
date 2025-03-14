import PublicOfferJsonLd from '@/components/client/json-ld/public-offer-json-ld'

type Params = Promise<{ locale: ILocale }>

const baseUrl = process.env.NEXT_URL

export async function generateMetadata({ params }: { params: Params }) {
  const { locale } = await params
  const isUk = locale === 'uk'

  return {
    title: isUk ? 'Публічна пропозиція' : 'Public Offer',
    description: isUk
      ? 'Умови публічної пропозиції'
      : 'Terms of the public offer',
    openGraph: {
      title: isUk ? 'Публічна пропозиція' : 'Public Offer',
      description: isUk
        ? 'Умови публічної пропозиції'
        : 'Terms of the public offer',
      url: `${baseUrl}/${locale}/public-offer`,
    },
    twitter: {
      card: 'summary_large_image',
      title: isUk ? 'Публічна пропозиція' : 'Public Offer',
      description: isUk
        ? 'Умови публічної пропозиції'
        : 'Terms of the public offer',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/public-offer`,
    },
  }
}

export default async function Page({ params }: { params: Params }) {
  const { locale } = await params

  let MarkdownToHtml
  try {
    MarkdownToHtml = await import(
      `@/data/public-offer/${locale}-public-offer.mdx`
    )
  } catch (error) {
    console.error(`Cannot load privacy policy for locale: ${locale}`, error)
    return <div>Error loading privacy public offer content.</div>
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
