import { getLocale } from 'next-intl/server'

import {
  buildOrganization,
  buildProductNode,
  buildWebsite,
  languageTag,
  localizedUrl,
  serializeJsonLd,
  WEBSITE_ID,
} from '@/utils/json-ld'

interface IMainJsonLdProps {
  products: IProduct[]
}

export default async function MainJsonLd({ products }: IMainJsonLdProps) {
  const locale = (await getLocale()) as ILocale
  const canonicalUrl = localizedUrl(locale)
  const pageId = `${canonicalUrl}#webpage`
  const itemListId = `${canonicalUrl}#top-products`
  const pageName =
    locale === 'uk'
      ? "Сушені снеки з м'яса, овочів і фруктів — Slice & Dry's"
      : "Dried meat, vegetable and fruit snacks — Slice & Dry's"
  const pageDescription =
    locale === 'uk'
      ? "Натуральні сушені снеки з м'яса, овочів і фруктів без консервантів."
      : 'Natural dried meat, vegetable and fruit snacks without preservatives.'
  const listName = locale === 'uk' ? 'Популярні сушеники' : 'Popular snacks'

  const productNodes = products.flatMap((product) => {
    if (!product.category || !product.slug) return []

    const url = localizedUrl(
      locale,
      `products/${product.category}/product/${product.slug}`,
    )

    return [buildProductNode(product, url)]
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      buildWebsite(),
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: canonicalUrl,
        name: pageName,
        description: pageDescription,
        inLanguage: languageTag(locale),
        isPartOf: { '@id': WEBSITE_ID },
        mainEntity: { '@id': itemListId },
      },
      {
        '@type': 'ItemList',
        '@id': itemListId,
        name: listName,
        numberOfItems: productNodes.length,
        itemListElement: productNodes.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: { '@id': product['@id'] },
        })),
      },
      ...productNodes,
    ],
  }

  return (
    <script
      id="main-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}
