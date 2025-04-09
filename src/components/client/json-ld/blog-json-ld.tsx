import { FC } from 'react'
import Script from 'next/script'
import { getLocale, getTranslations } from 'next-intl/server'

import { blogMetaData } from '@/data/blog/blog-meta-data'

type JsonLdProps = Readonly<{
  data: IGetPostsClient
}>

const url = process.env.NEXT_URL

const BlogJsonLd: FC<JsonLdProps> = async ({ data }) => {
  const locale = (await getLocale()) as ILocale
  const t = await getTranslations('Breadcrumbs')

  const canonicalUrl = `${url}/${locale}/blog`

  const canonical =
    data.currentPage > 1
      ? `${canonicalUrl}?page=${data.currentPage}`
      : canonicalUrl

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: blogMetaData[locale].title,
    description: blogMetaData[locale].description,
    url: canonical,
    image: `${url}/blog-image.webp`,
    alternates: {
      canonical,
      languages: {
        uk: `${url}/uk/blog`,
        en: `${url}/en/blog`,
      },
    },
    pagination: {
      '@type': 'Pagination',
      prev:
        data.currentPage > 1
          ? `${url}/blog?page=${data.currentPage - 1}`
          : undefined,
      next:
        data.currentPage < data.totalPages
          ? `${url}/blog?page=${data.currentPage + 1}`
          : undefined,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('Home'),
          item: url,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('Blog'),
          item: canonicalUrl,
        },
        ...(data.currentPage > 1
          ? [
              {
                '@type': 'ListItem',
                position: 3,
                name: `${t('Page')} ${data.currentPage}`,
              },
            ]
          : []),
      ],
    },
    hasPart: data.postsLocalized.map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      image: post.img,
      datePublished: post.createdAt,
      url: `${canonicalUrl}/${post.slug}`,
    })),
  }

  return (
    <Script
      id="blog-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default BlogJsonLd
