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

interface PrivacyPolicyJsonLdProps {
  locale: ILocale
}

export default function PrivacyPolicyJsonLd({
  locale,
}: PrivacyPolicyJsonLdProps) {
  const isUk = locale === 'uk'
  const canonicalUrl = localizedUrl(locale, 'privacy-policy')
  const pageName = isUk ? 'Політика конфіденційності' : 'Privacy Policy'
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
          ? 'Умови політики конфіденційності'
          : 'Privacy policy details',
        inLanguage: languageTag(locale),
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': breadcrumbId },
        about: { '@id': ORGANIZATION_ID },
      },
    ],
  }

  return (
    <script
      id="privacy-policy-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}
