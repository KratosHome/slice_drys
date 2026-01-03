import React, { FC } from 'react'
import { SITE_URL } from '@/data/contacts'

interface PublicOfferJsonLdProps {
  locale: ILocale
}

const PublicOfferJsonLd: FC<PublicOfferJsonLdProps> = ({ locale }) => {
  const isUk = locale === 'uk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: isUk ? 'Публічна пропозиція' : 'Public Offer',
    description: isUk
      ? 'Умови публічної пропозиції'
      : 'Terms of the public offer',
    url: `${SITE_URL}/${locale}/public-offer`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default PublicOfferJsonLd
