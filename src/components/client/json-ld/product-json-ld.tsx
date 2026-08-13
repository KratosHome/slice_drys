import { getLocale } from 'next-intl/server'

import {
  buildOrganization,
  buildBreadcrumbList,
  buildProductNode,
  buildWebsite,
  languageTag,
  localizedUrl,
  serializeJsonLd,
  WEBSITE_ID,
} from '@/utils/json-ld'

interface ProductJsonLdProps {
  productData: IProduct
  canonicalUrl: string
  categoryName: string
  categoryUrl: string
}

export default async function ProductJsonLd({
  productData,
  canonicalUrl,
  categoryName,
  categoryUrl,
}: ProductJsonLdProps) {
  const locale = (await getLocale()) as ILocale
  const pageId = `${canonicalUrl}#webpage`
  const productId = `${canonicalUrl}#product`
  const breadcrumbId = `${canonicalUrl}#breadcrumb`
  const homeName = locale === 'uk' ? 'Головна' : 'Home'
  const productNode = {
    ...buildProductNode(productData, canonicalUrl),
    mainEntityOfPage: { '@id': pageId },
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      buildWebsite(),
      buildBreadcrumbList(breadcrumbId, [
        { name: homeName, url: localizedUrl(locale) },
        { name: categoryName, url: categoryUrl },
        { name: productData.name, url: canonicalUrl },
      ]),
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: canonicalUrl,
        name: productData.title || productData.name,
        description: productData.metaDescription || productData.description,
        inLanguage: languageTag(locale),
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': breadcrumbId },
        mainEntity: { '@id': productId },
      },
      productNode,
    ],
  }

  return (
    <script
      id="product-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}
