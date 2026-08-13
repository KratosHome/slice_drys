import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/data/contacts'
import { locales } from '@/data/locales'
import { getCategories } from '@/server/categories/get-categories.server'
import { getPostsUrls } from '@/server/posts/get-posts-urls.server'
import { getProductsUrls } from '@/server/products/get-products-urls.server'
import { getCanonicalProductCategorySlug } from '@/utils/product-category'

export const revalidate = 3600

type SitemapCategory = Omit<ICategory, 'children'> & {
  updatedAt?: Date | string
  children: SitemapCategory[]
}

type SitemapItemOptions = Omit<
  MetadataRoute.Sitemap[number],
  'url' | 'alternates'
>

const DEFAULT_LOCALE: ILocale = 'uk'
const siteUrl = SITE_URL.replace(/\/+$/, '')

function toDate(value: Date | string | null | undefined): Date | undefined {
  if (!value) return undefined

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function latestDate(
  values: Array<Date | string | null | undefined>,
): Date | undefined {
  return values.reduce<Date | undefined>((latest, value) => {
    const date = toDate(value)
    if (!date) return latest

    return !latest || date.getTime() > latest.getTime() ? date : latest
  }, undefined)
}

function localizedUrl(locale: ILocale, path = ''): string {
  return `${siteUrl}/${locale}${path}`
}

function localizedEntries(
  path: string,
  options: SitemapItemOptions,
): MetadataRoute.Sitemap {
  const languages = {
    ...Object.fromEntries(
      locales.map((locale) => [locale, localizedUrl(locale, path)]),
    ),
    'x-default': localizedUrl(DEFAULT_LOCALE, path),
  }

  return locales.map((locale) => ({
    url: localizedUrl(locale, path),
    ...options,
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categoriesResult, productsResult, postsResult] = await Promise.all([
    getCategories(),
    getProductsUrls(),
    getPostsUrls(),
  ])

  const failedSources = [
    !categoriesResult.success && `categories: ${categoriesResult.message}`,
    !productsResult.success && `products: ${productsResult.message}`,
    !postsResult.success && `posts: ${postsResult.message}`,
  ].filter(Boolean)

  // Never publish a deceptively small sitemap after a transient database
  // failure. With ISR, throwing keeps the last successfully generated value.
  if (failedSources.length > 0) {
    throw new Error(`Sitemap data is incomplete (${failedSources.join('; ')})`)
  }

  const categories = categoriesResult.data as SitemapCategory[]
  const products = [...productsResult.data].sort((a, b) =>
    a.slug.localeCompare(b.slug),
  )
  const posts = [...postsResult.data].sort((a, b) =>
    a.slug.localeCompare(b.slug),
  )

  const productsLastModified = latestDate(
    products.map(({ updatedAt }) => updatedAt),
  )
  const postsLastModified = latestDate(posts.map(({ updatedAt }) => updatedAt))
  const categoriesLastModified = latestDate(
    categories.flatMap((category) => [
      category.updatedAt,
      ...(category.children ?? []).map((child) => child.updatedAt),
    ]),
  )
  const siteLastModified = latestDate([
    productsLastModified,
    postsLastModified,
    categoriesLastModified,
  ])

  const staticPages: MetadataRoute.Sitemap = [
    ...localizedEntries('', {
      lastModified: siteLastModified,
      changeFrequency: 'weekly',
      priority: 1,
    }),
    ...localizedEntries('/blog', {
      lastModified: postsLastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    }),
    ...localizedEntries('/contacts', {
      changeFrequency: 'yearly',
      priority: 0.6,
    }),
    ...localizedEntries('/wholesale', {
      changeFrequency: 'monthly',
      priority: 0.7,
    }),
    ...localizedEntries('/privacy-policy', {
      changeFrequency: 'yearly',
      priority: 0.3,
    }),
    ...localizedEntries('/public-offer', {
      changeFrequency: 'yearly',
      priority: 0.3,
    }),
  ]

  const categoryEntries = categories.flatMap((category) => {
    const rootProductsLastModified = latestDate(
      products
        .filter((product) =>
          product.categories.some(
            (productCategory) => productCategory.slug === category.slug,
          ),
        )
        .map(({ updatedAt }) => updatedAt),
    )

    const rootEntries = localizedEntries(`/products/${category.slug}`, {
      lastModified: latestDate([category.updatedAt, rootProductsLastModified]),
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    const childEntries = (category.children ?? []).flatMap((child) => {
      const childProductsLastModified = latestDate(
        products
          .filter((product) =>
            product.categories.some(
              (productCategory) => productCategory.slug === child.slug,
            ),
          )
          .map(({ updatedAt }) => updatedAt),
      )

      return localizedEntries(`/products/${category.slug}/${child.slug}`, {
        lastModified: latestDate([child.updatedAt, childProductsLastModified]),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    })

    return [...rootEntries, ...childEntries]
  })

  const productEntries = products.flatMap((product) => {
    const categorySlug = getCanonicalProductCategorySlug(product.categories)
    if (!categorySlug) return []

    return localizedEntries(
      `/products/${categorySlug}/product/${product.slug}`,
      {
        lastModified: toDate(product.updatedAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    )
  })

  const postEntries = posts.flatMap((post) =>
    localizedEntries(`/blog/${post.slug}`, {
      lastModified: toDate(post.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }),
  )

  return [...staticPages, ...categoryEntries, ...productEntries, ...postEntries]
}
