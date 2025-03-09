import type { MetadataRoute } from 'next'
import { locales } from '@/data/locales'
import { getCategoryUrls } from '@/server/categories/get-category-urls.server'
import { getProductsUrls } from '@/server/products/get-products-urls.server'
import { getPostsUrls } from '@/server/posts/get-ports-urls.server'

const url = process.env.NEXT_URL

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categoriesData = await getCategoryUrls()
  const productsData = await getProductsUrls()
  const postsData = await getPostsUrls()

  const homePage = locales.map((lang) => ({
    url: `${url}/${lang}`,
    lastModified: new Date('2024-03-01'),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const privacyPolicy = locales.map((lang) => ({
    url: `${url}/${lang}/privacy-policy`,
    lastModified: new Date('2024-03-01'),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }))

  const publicOffer = locales.map((lang) => ({
    url: `${url}/${lang}/public-offer`,
    lastModified: new Date('2024-03-01'),
    changeFrequency: 'yearly' as const,
    priority: 0.8,
  }))

  const blog = locales.map((lang) => ({
    url: `${url}/${lang}/blog`,
    lastModified: new Date('2024-03-01'),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const postsUrls = postsData.data.flatMap((post: { slug: string }) =>
    locales.map((lang) => ({
      url: `${url}/${lang}/blog/${post.slug}`,
      lastModified: new Date('2024-03-01'),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  )

  const categoriesUrls = categoriesData.data.flatMap(
    (category: { slug: string }) =>
      locales.map((lang) => ({
        url: `${url}/${lang}/${category.slug}`,
        lastModified: new Date('2024-03-01'),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      })),
  )

  const productsUrls = productsData.data.flatMap(
    (product: { slug: string; categories?: Array<{ slug: string }> }) =>
      (product.categories ?? []).flatMap((category) =>
        locales.map((lang) => ({
          url: `${url}/${lang}/${category.slug}/${product.slug}`,
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
