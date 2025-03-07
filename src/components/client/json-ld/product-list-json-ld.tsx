import { FC } from 'react'

interface JsonLdProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentCategories: any
  locale: string
  canonicalUrl: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  productsData: any
  url: string
  categoriesParam: string
}

const ProductListJsonLd: FC<JsonLdProps> = ({
  currentCategories,
  locale,
  canonicalUrl,
  productsData,
  url,
  categoriesParam,
}) => {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: currentCategories.data.name[locale],
    description:
      currentCategories.data.metaDescription[locale] ||
      currentCategories.data.description[locale],
    url: canonicalUrl,
    image: currentCategories.image || `${url}/default-category-image.jpg`,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        uk: `${url}/uk/${categoriesParam}`,
        en: `${url}/en/${categoriesParam}`,
      },
    },
    pagination: {
      prev:
        productsData.currentPage > 1
          ? `${url}/category/?page=${productsData.currentPage - 1}`
          : canonicalUrl,
      next:
        productsData.currentPage < productsData.totalPages
          ? `${url}/category/?page=${productsData.currentPage + 1}`
          : canonicalUrl,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Головна',
          item: url,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: currentCategories.data.name[locale],
          item: canonicalUrl,
        },
      ],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default ProductListJsonLd
