import React, { FC } from 'react'
import { SITE_URL } from '@/data/contacts'

interface PrivacyPolicyJsonLdProps {
  locale: ILocale
}

const PrivacyPolicyJsonLd: FC<PrivacyPolicyJsonLdProps> = ({ locale }) => {
  const isUk = locale === 'uk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: isUk ? 'Політика конфіденційності' : 'Privacy Policy',
    description: isUk
      ? 'Умови політики конфіденційності'
      : 'Privacy policy details',
    url: `${SITE_URL}/${locale}/privacy-policy`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default PrivacyPolicyJsonLd
