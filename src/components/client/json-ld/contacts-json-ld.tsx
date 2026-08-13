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

interface ContactsJsonLdProps {
  locale: ILocale
}

export default function ContactsJsonLd({ locale }: ContactsJsonLdProps) {
  const canonicalUrl = localizedUrl(locale, 'contacts')
  const pageId = `${canonicalUrl}#webpage`
  const breadcrumbId = `${canonicalUrl}#breadcrumb`
  const isUk = locale === 'uk'
  const pageName = isUk ? 'Контакти' : 'Contacts'

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
        '@type': 'ContactPage',
        '@id': pageId,
        url: canonicalUrl,
        name: pageName,
        description: isUk
          ? "Контактна інформація Slice & Dry's"
          : "Slice & Dry's contact information",
        inLanguage: languageTag(locale),
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': breadcrumbId },
        mainEntity: { '@id': ORGANIZATION_ID },
        about: { '@id': ORGANIZATION_ID },
      },
    ],
  }

  return (
    <script
      id="contacts-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}
