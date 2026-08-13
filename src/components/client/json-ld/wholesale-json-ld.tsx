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

interface WholesaleJsonLdProps {
  locale: ILocale
}

export default function WholesaleJsonLd({ locale }: WholesaleJsonLdProps) {
  const isUk = locale === 'uk'
  const canonicalUrl = localizedUrl(locale, 'wholesale')
  const pageName = isUk ? 'Сушеники оптом' : 'Wholesale dried goods'
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
          ? 'Оптові закупівлі натуральних сушених снеків'
          : 'Wholesale purchasing of natural dried snacks',
        inLanguage: languageTag(locale),
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': breadcrumbId },
        about: { '@id': ORGANIZATION_ID },
        audience: {
          '@type': 'BusinessAudience',
          audienceType: isUk ? 'Оптові покупці' : 'Wholesale buyers',
        },
      },
    ],
  }

  return (
    <script
      id="wholesale-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}
