import React, { FC } from 'react'

interface PublicOfferJsonLdProps {
  locale: ILocale
}

const PublicOfferJsonLd: FC<PublicOfferJsonLdProps> = ({ locale }) => {
  const baseUrl = process.env.NEXT_URL

  const isUk = locale === 'uk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: isUk ? 'Публічна пропозиція' : 'Public Offer',
    description: isUk
      ? 'Умови публічної пропозиції'
      : 'Terms of the public offer',
    url: `${baseUrl}/${locale}/public-offer`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default PublicOfferJsonLd
