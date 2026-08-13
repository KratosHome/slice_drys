import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import { revalidateDay } from '@/constants/revalidate'
import { fetchTags } from '@/data/fetch-tags'
import { getCategories } from '@/server/categories/get-categories.server'
import { getCurrentCategory } from '@/server/categories/curent-categories.server'
import { getPost, getPosts } from '@/server/posts/get-posts.server'
import { getProductBySlug } from '@/server/products/get-product-by-slug.server'
import { getProductWeights } from '@/server/products/get-product-weights'
import {
  getProductsList,
  type IGetProductsParams,
} from '@/server/products/get-products-list.server'
import { getProductsSliderProduct } from '@/server/products/get-products-slider-product.server'
import { getProductsSliderMain } from '@/server/products/get-productsSliderMain.server'

type PublicResult = {
  success: boolean
  message?: string
}

const throwOnInfrastructureFailure = <T extends PublicResult>(result: T): T => {
  if (!result.success && !result.message?.toLowerCase().includes('not found')) {
    throw new Error(result.message || 'Public data request failed')
  }

  return result
}

const getCachedCategories = unstable_cache(
  async (slug: string | null, locale: ILocale | null) =>
    throwOnInfrastructureFailure(
      await getCategories(slug ?? undefined, locale ?? undefined),
    ),
  ['public-categories-v1'],
  {
    revalidate: revalidateDay,
    tags: [fetchTags.menu, fetchTags.products],
  },
)

const getCachedCurrentCategory = unstable_cache(
  async (slug: string) =>
    throwOnInfrastructureFailure(await getCurrentCategory(slug)),
  ['public-current-category-v1'],
  {
    revalidate: revalidateDay,
    tags: [fetchTags.menu, fetchTags.products],
  },
)

const getCachedMainProducts = unstable_cache(
  async (locale: ILocale) =>
    throwOnInfrastructureFailure(await getProductsSliderMain(locale)),
  ['public-main-products-v2'],
  {
    revalidate: revalidateDay,
    tags: [fetchTags.products, fetchTags.product],
  },
)

const getCachedProduct = unstable_cache(
  async (slug: string, locale: ILocale) =>
    throwOnInfrastructureFailure(await getProductBySlug({ slug, locale })),
  ['public-product-v1'],
  {
    revalidate: revalidateDay,
    tags: [fetchTags.products, fetchTags.product, fetchTags.menu],
  },
)

const getCachedProductRecommendations = unstable_cache(
  async (locale: ILocale, productSlug: string) =>
    throwOnInfrastructureFailure(
      await getProductsSliderProduct(locale, productSlug),
    ),
  ['public-product-recommendations-v2'],
  {
    revalidate: revalidateDay,
    tags: [fetchTags.products, fetchTags.product, fetchTags.menu],
  },
)

const getCachedProductsList = unstable_cache(
  async (options: IGetProductsParams) =>
    throwOnInfrastructureFailure(await getProductsList(options)),
  ['public-products-list-v2'],
  {
    revalidate: revalidateDay,
    tags: [fetchTags.products, fetchTags.product, fetchTags.menu],
  },
)

const getCachedProductWeights = unstable_cache(
  async (categorySlug: string) =>
    throwOnInfrastructureFailure(await getProductWeights(categorySlug)),
  ['public-product-weights-v1'],
  {
    revalidate: revalidateDay,
    tags: [fetchTags.products, fetchTags.product, fetchTags.menu],
  },
)

const getCachedPosts = unstable_cache(
  async (locale: ILocale, page: number, limit: number) =>
    throwOnInfrastructureFailure(await getPosts({ locale, page, limit })),
  ['public-posts-v2'],
  {
    revalidate: revalidateDay,
    tags: [fetchTags.posts, fetchTags.post],
  },
)

const getCachedPost = unstable_cache(
  async (locale: ILocale, slug: string) =>
    throwOnInfrastructureFailure(await getPost({ locale, slug })),
  ['public-post-v1'],
  {
    revalidate: revalidateDay,
    tags: [fetchTags.posts, fetchTags.post],
  },
)

export const getPublicCategories = cache((slug?: string, locale?: ILocale) =>
  getCachedCategories(slug ?? null, locale ?? null),
)

export const getPublicCurrentCategory = cache((slug: string) =>
  getCachedCurrentCategory(slug),
)

export const getPublicMainProducts = cache((locale: ILocale) =>
  getCachedMainProducts(locale),
)

export const getPublicProduct = cache((slug: string, locale: ILocale) =>
  getCachedProduct(slug, locale),
)

export const getPublicProductRecommendations = cache(
  (locale: ILocale, productSlug: string) =>
    getCachedProductRecommendations(locale, productSlug),
)

export const getPublicProductsList = cache((options: IGetProductsParams) =>
  getCachedProductsList(options),
)

export const getPublicProductWeights = cache((categorySlug: string) =>
  getCachedProductWeights(categorySlug),
)

export const getPublicPosts = cache(
  (locale: ILocale, page: number, limit: number) =>
    getCachedPosts(locale, page, limit),
)

export const getPublicPost = cache((locale: ILocale, slug: string) =>
  getCachedPost(locale, slug),
)
