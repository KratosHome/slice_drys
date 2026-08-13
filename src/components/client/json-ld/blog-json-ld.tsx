import { getLocale, getTranslations } from 'next-intl/server'

import { blogMetaData } from '@/data/blog/blog-meta-data'
import {
  absoluteUrl,
  buildBreadcrumbList,
  buildOrganization,
  buildWebsite,
  languageTag,
  localizedUrl,
  ORGANIZATION_ID,
  serializeJsonLd,
  SITE_ORIGIN,
  toIsoDate,
  WEBSITE_ID,
} from '@/utils/json-ld'

type JsonLdProps = Readonly<{
  data: IGetPostsClient
}>

export default async function BlogJsonLd({ data }: JsonLdProps) {
  const locale = (await getLocale()) as ILocale
  const t = await getTranslations('breadcrumbs')
  const blogUrl = localizedUrl(locale, 'blog')
  const canonicalUrl =
    data.currentPage > 1 ? `${blogUrl}?page=${data.currentPage}` : blogUrl
  const pageId = `${canonicalUrl}#webpage`
  const itemListId = `${canonicalUrl}#itemlist`
  const breadcrumbId = `${canonicalUrl}#breadcrumb`
  const pageName =
    data.currentPage > 1
      ? `${blogMetaData[locale].title} — ${t('page')} ${data.currentPage}`
      : blogMetaData[locale].title

  const posts = data.postsLocalized.map((post) => {
    const url = localizedUrl(locale, `blog/${post.slug}`)

    return {
      post,
      url,
      id: `${url}#article`,
    }
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(locale),
      buildWebsite(),
      buildBreadcrumbList(breadcrumbId, [
        { name: t('home'), url: localizedUrl(locale) },
        { name: t('blog'), url: blogUrl },
        ...(data.currentPage > 1
          ? [{ name: `${t('page')} ${data.currentPage}`, url: canonicalUrl }]
          : []),
      ]),
      {
        '@type': 'CollectionPage',
        '@id': pageId,
        url: canonicalUrl,
        name: pageName,
        description: blogMetaData[locale].description,
        image: absoluteUrl(`${SITE_ORIGIN}/blog-image.webp`),
        inLanguage: languageTag(locale),
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': breadcrumbId },
        mainEntity: { '@id': itemListId },
      },
      {
        '@type': 'ItemList',
        '@id': itemListId,
        name: pageName,
        numberOfItems: posts.length,
        itemListOrder: 'https://schema.org/ItemListOrderDescending',
        itemListElement: posts.map(({ id }, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: { '@id': id },
        })),
      },
      ...posts.map(({ post, url, id }) => ({
        '@type': 'BlogPosting',
        '@id': id,
        url,
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
        mainEntityOfPage: { '@id': `${url}#webpage` },
      })),
    ],
  }

  return (
    <script
      id="blog-json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
    />
  )
}
