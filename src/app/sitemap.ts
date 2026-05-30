import type { MetadataRoute } from 'next'

import { locales } from '@/data/locales'

import { getCategories } from '@/server/categories/get-categories.server'
import { getProductsUrls } from '@/server/products/get-products-urls.server'
import { getPostsUrls } from '@/server/posts/get-ports-urls.server'
import { SITE_URL } from '@/data/contacts'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categoriesData, productsData, postsData] = await Promise.all([
    getCategories(),
    getProductsUrls(),
    getPostsUrls(),
  ])

  const homePage = locales.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    lastModified: new Date('2024-03-01'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const privacyPolicy = locales.map((lang) => ({
    url: `${SITE_URL}/${lang}/privacy-policy`,
    lastModified: new Date('2024-03-01'),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }))

  const publicOffer = locales.map((lang) => ({
    url: `${SITE_URL}/${lang}/public-offer`,
    lastModified: new Date('2024-03-01'),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }))

  const blog = locales.map((lang) => ({
    url: `${SITE_URL}/${lang}/blog`,
    lastModified: new Date('2024-03-01'),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const postsUrls = postsData.data.flatMap((post: { slug: string }) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}/blog/${post.slug}`,
      lastModified: new Date('2024-03-01'),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  )

  const categoriesUrls = (categoriesData.data as unknown as ICategory[]).flatMap(
    (category) => {
      const rootUrls = locales.map((lang) => ({
        url: `${SITE_URL}/${lang}/products/${category.slug}`,
        lastModified: new Date('2024-03-01'),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
      const childUrls = (category.children ?? []).flatMap((child) =>
        locales.map((lang) => ({
          url: `${SITE_URL}/${lang}/products/${category.slug}/${child.slug}`,
          lastModified: new Date('2024-03-01'),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        })),
      )

      return [...rootUrls, ...childUrls]
    },
  )

  const productsUrls = productsData.data.flatMap(
    (product: { slug: string; categories?: Array<{ slug: string }> }) =>
      (product.categories ?? []).flatMap((category) =>
        locales.map((lang) => ({
          url: `${SITE_URL}/${lang}/products/${category.slug}/product/${product.slug}`,
          lastModified: new Date('2024-03-01'),
          changeFrequency: 'weekly' as const,
          priority: 0.5,
        })),
      ),
  )

  return [
    ...homePage,
    ...blog,
    ...categoriesUrls,
    ...productsUrls,
    ...postsUrls,
    ...privacyPolicy,
    ...publicOffer,
  ]
}
