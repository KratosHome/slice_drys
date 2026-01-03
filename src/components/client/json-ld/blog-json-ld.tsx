import { FC } from 'react'
import Script from 'next/script'
import { getLocale, getTranslations } from 'next-intl/server'

import { blogMetaData } from '@/data/blog/blog-meta-data'
import { SITE_URL } from '@/data/contacts'

type JsonLdProps = Readonly<{
  data: IGetPostsClient
}>

const BlogJsonLd: FC<JsonLdProps> = async ({ data }) => {
  const locale = (await getLocale()) as ILocale
  const t = await getTranslations('breadcrumbs')

  const canonicalUrl = `${SITE_URL}/${locale}/blog`

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
    image: `${SITE_URL}/blog-image.webp`,
    alternates: {
      canonical,
      languages: {
        uk: `${SITE_URL}/uk/blog`,
        en: `${SITE_URL}/en/blog`,
      },
    },
    pagination: {
      '@type': 'Pagination',
      prev:
        data.currentPage > 1
          ? `${SITE_URL}/blog?page=${data.currentPage - 1}`
          : undefined,
      next:
        data.currentPage < data.totalPages
          ? `${SITE_URL}/blog?page=${data.currentPage + 1}`
          : undefined,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('home'),
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('blog'),
          item: canonicalUrl,
        },
        ...(data.currentPage > 1
          ? [
              {
                '@type': 'ListItem',
                position: 3,
                name: `${t('page')} ${data.currentPage}`,
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
