import { FC } from 'react'
import Script from 'next/script'
import { getLocale, getTranslations } from 'next-intl/server'

import { blogMetaData } from '@/data/blog/blog-meta-data'

type JsonLdProps = Readonly<{
  post: IPost
}>

const url = process.env.NEXT_URL

const BlogItemJsonLd: FC<JsonLdProps> = async ({ post }) => {
  const locale = (await getLocale()) as ILocale
  const t = await getTranslations('Breadcrumbs')

  const canonicalUrl = `${url}/${locale}/blog/${post.slug}`

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
        url: `${url}/logo.png`,
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
          name: t('Home'),
          item: url,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('Blog'),
          item: `${url}/${locale}/blog`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: canonicalUrl,
        },
      ],
    },
    /*
        hasPart: reviews.map((review) => ({
      '@type': 'Review',
      '@id': `${canonicalUrl}/#review-${review._id}`,
      reviewBody: review.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating.toString(),
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: review.author,
      },
      itemReviewed: {
        '@type': 'WebSite',
        name: "Slice & Dry's",
        url,
      },
    })),
     */
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
