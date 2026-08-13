import { getLocale, getTranslations } from 'next-intl/server'

import {
  absoluteUrl,
  buildBreadcrumbList,
  buildOrganization,
  buildWebsite,
  languageTag,
  localizedUrl,
  ORGANIZATION_ID,
  serializeJsonLd,
  toIsoDate,
  WEBSITE_ID,
} from '@/utils/json-ld'

type JsonLdProps = Readonly<{
  post: IPost
}>

export default async function BlogItemJsonLd({ post }: JsonLdProps) {
  const locale = (await getLocale()) as ILocale
  const t = await getTranslations('breadcrumbs')
  const canonicalUrl = localizedUrl(locale, `blog/${post.slug}`)
  const pageId = `${canonicalUrl}#webpage`
  const articleId = `${canonicalUrl}#article`
  const breadcrumbId = `${canonicalUrl}#breadcrumb`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      buildWebsite(),
      buildBreadcrumbList(breadcrumbId, [
        { name: t('home'), url: localizedUrl(locale) },
        { name: t('blog'), url: localizedUrl(locale, 'blog') },
        { name: post.title, url: canonicalUrl },
      ]),
      {
        '@type': 'WebPage',
        '@id': pageId,
        url: canonicalUrl,
        name: post.title,
        description: post.metaDescription,
        inLanguage: languageTag(locale),
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': breadcrumbId },
        mainEntity: { '@id': articleId },
      },
      {
        '@type': 'BlogPosting',
        '@id': articleId,
        url: canonicalUrl,
        headline: post.title,
        description: post.metaDescription,
        image: absoluteUrl(post.img),
        datePublished: toIsoDate(post.createdAt),
        dateModified: toIsoDate(post.updatedAt) ?? toIsoDate(post.createdAt),
        inLanguage: languageTag(locale),
        author: {
          '@type': 'Person',
          name: post.author,
        },
        publisher: { '@id': ORGANIZATION_ID },
        mainEntityOfPage: { '@id': pageId },
      },
    ],
  }

  return (
    <script
      id="post-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}
