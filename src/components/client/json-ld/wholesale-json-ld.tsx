import React, { FC } from 'react'
import { SITE_URL } from '@/data/contacts'

interface WholesaleJsonLdProps {
  locale: ILocale
}

const WholesaleJsonLd: FC<WholesaleJsonLdProps> = ({ locale }) => {
  const isUk = locale === 'uk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: isUk ? 'Оптові Сушеники' : 'Wholesale Dried Goods',
    description: isUk
      ? 'Сторінка оптових закупівель наших сушеників'
      : 'Our wholesale page for dried products',
    url: `${SITE_URL}/${locale}/wholesale`,
    brand: 'Slice&Drys',
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default WholesaleJsonLd
