import React, { FC } from 'react'

interface WholesaleJsonLdProps {
  locale: ILocale
}

const ContactsJsonLd: FC<WholesaleJsonLdProps> = ({ locale }) => {
  const baseUrl = process.env.NEXT_URL

  const canonicalUrl = `${baseUrl}/${locale}/contacts`

  const isUk = locale === 'uk'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: "Slice & Dry's",
    url: canonicalUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+38 (093) 979 79 10',
      email: 'slice&drys@gmail.com',
      contactType: isUk ? 'Служба підтримки' : 'Customer Service',
      areaServed: 'UA',
      availableLanguage: isUk
        ? ['Українська', 'Англійська']
        : ['Ukrainian', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: isUk ? 'вул. Надпільна 248А' : '248A Nadpilna St.',
      addressLocality: isUk ? 'Черкаси' : 'Cherkasy',
      addressCountry: 'UA',
    },
    openingHours: isUk ? 'Пн-Нд 10:00-19:00' : 'Mo-Su 10:00-19:00',
    sameAs: [
      'https://www.facebook.com/slicedrys',
      'https://www.instagram.com/slicedrys',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default ContactsJsonLd
