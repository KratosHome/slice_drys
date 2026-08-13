import {
  buildBreadcrumbList,
  buildOrganization,
  buildWebsite,
  languageTag,
  localizedUrl,
  ORGANIZATION_ID,
  serializeJsonLd,
  WEBSITE_ID,
} from '@/utils/json-ld'

interface PublicOfferJsonLdProps {
  locale: ILocale
}

export default function PublicOfferJsonLd({ locale }: PublicOfferJsonLdProps) {
  const isUk = locale === 'uk'
  const canonicalUrl = localizedUrl(locale, 'public-offer')
  const pageName = isUk ? 'Публічна оферта' : 'Public Offer'
  const breadcrumbId = `${canonicalUrl}#breadcrumb`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      buildWebsite(),
      buildBreadcrumbList(breadcrumbId, [
        { name: isUk ? 'Головна' : 'Home', url: localizedUrl(locale) },
        { name: pageName, url: canonicalUrl },
      ]),
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: pageName,
        description: isUk
          ? 'Умови публічної оферти інтернет-магазину'
          : 'Online store public offer terms',
        inLanguage: languageTag(locale),
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': breadcrumbId },
        about: { '@id': ORGANIZATION_ID },
      },
    ],
  }

  return (
    <script
      id="public-offer-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}
