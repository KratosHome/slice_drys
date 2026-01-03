import { FC } from 'react'
import Script from 'next/script'
import { getLocale, getTranslations } from 'next-intl/server'

import { blogMetaData } from '@/data/blog/blog-meta-data'
import { SITE_URL } from '@/data/contacts'

type JsonLdProps = Readonly<{
  post: IPost
}>

const BlogItemJsonLd: FC<JsonLdProps> = async ({ post }) => {
  const locale = (await getLocale()) as ILocale
  const t = await getTranslations('breadcrumbs')

  const canonicalUrl = `${SITE_URL}/${locale}/blog/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.content,
    image: post.img,
    datePublished: post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: blogMetaData[locale].title,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
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
          item: `${SITE_URL}/${locale}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: canonicalUrl,
        },
      ],
    },
  }

  return (
    <Script
      id="post-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default BlogItemJsonLd
