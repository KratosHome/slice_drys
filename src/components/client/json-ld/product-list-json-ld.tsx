import {
  absoluteUrl,
  buildBreadcrumbList,
  buildOrganization,
  buildProductNode,
  buildWebsite,
  languageTag,
  localizedUrl,
  serializeJsonLd,
  WEBSITE_ID,
} from '@/utils/json-ld'

interface JsonLdProps {
  currentCategories: ICategory
  rootCategory?: ICategory
  locale: string
  canonicalUrl: string
  productsData: {
    data: IProduct[]
    currentPage: number
    totalItems: number
    totalPages: number
  }
  categoriesParam: string
}

export default function ProductListJsonLd({
  currentCategories,
  rootCategory,
  locale,
  canonicalUrl,
  productsData,
  categoriesParam,
}: JsonLdProps) {
  const pageLocale = locale as ILocale
  const pageId = `${canonicalUrl}#webpage`
  const itemListId = `${canonicalUrl}#itemlist`
  const breadcrumbId = `${canonicalUrl}#breadcrumb`
  const categoryName = currentCategories.name[pageLocale]
  const rootCategorySlug = categoriesParam.split('/')[1]
  const homeName = pageLocale === 'uk' ? 'Головна' : 'Home'
  const breadcrumbItems = [
    { name: homeName, url: localizedUrl(pageLocale) },
    ...(rootCategory && rootCategory.slug !== currentCategories.slug
      ? [
          {
            name: rootCategory.name[pageLocale],
            url: localizedUrl(pageLocale, `products/${rootCategory.slug}`),
          },
        ]
      : []),
    { name: categoryName, url: canonicalUrl },
  ]

  const products = productsData.data.flatMap((product) => {
    const categorySlug = product.category || rootCategorySlug
    if (!categorySlug || !product.slug) return []

    const productUrl = localizedUrl(
      pageLocale,
      `products/${categorySlug}/product/${product.slug}`,
    )

    return [
      buildProductNode({ ...product, category: categorySlug }, productUrl),
    ]
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(pageLocale),
      buildWebsite(),
      buildBreadcrumbList(breadcrumbId, breadcrumbItems),
      {
        '@type': 'CollectionPage',
        '@id': pageId,
        url: canonicalUrl,
        name: categoryName,
        description: currentCategories.metaDescription?.[pageLocale],
        image: absoluteUrl(currentCategories.image),
        inLanguage: languageTag(pageLocale),
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': breadcrumbId },
        mainEntity: { '@id': itemListId },
      },
      {
        '@type': 'ItemList',
        '@id': itemListId,
        name: categoryName,
        numberOfItems: products.length,
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: { '@id': product['@id'] },
        })),
      },
      ...products,
    ],
  }

  return (
    <script
      id="product-list-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}
