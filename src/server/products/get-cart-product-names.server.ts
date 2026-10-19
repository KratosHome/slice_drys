'use server'

import { unstable_cache } from 'next/cache'
import { revalidateDay } from '@/constants/revalidate'
import { fetchTags } from '@/data/fetch-tags'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Product } from './product-schema.server'

type CartProductNames = {
  id: string
  names: Partial<Record<ILocale, string>>
}

type ProductNamesDocument = {
  _id: { toString(): string }
  name?: Partial<Record<ILocale, unknown>>
}

const getCachedCartProductNames = unstable_cache(
  async (ids: string[]): Promise<CartProductNames[]> => {
    await connectToDbServer()
    const products = await Product.find(
      { _id: { $in: ids } },
      { _id: 1, 'name.uk': 1, 'name.en': 1 },
    ).lean<ProductNamesDocument[]>()

    const requestedIds = new Set(ids)
    return products.flatMap((product) => {
      const id = product._id.toString().toLowerCase()
      if (!requestedIds.has(id)) return []

      const names: CartProductNames['names'] = {}
      for (const locale of ['uk', 'en'] as const) {
        const name = product.name?.[locale]
        if (typeof name === 'string' && name.trim()) {
          names[locale] = name.trim()
        }
      }

      return Object.keys(names).length ? [{ id, names }] : []
    })
  },
  ['public-cart-product-names-v1'],
  {
    revalidate: revalidateDay,
    tags: [fetchTags.products, fetchTags.product],
  },
)

export async function getCartProductNames(
  ids: string[],
): Promise<CartProductNames[]> {
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.length > 100 ||
    Array.from(ids).some(
      (id) => typeof id !== 'string' || !/^[a-f\d]{24}$/i.test(id),
    )
  ) {
    return []
  }

  const normalizedIds = [...new Set(ids.map((id) => id.toLowerCase()))].sort()
  try {
    return await getCachedCartProductNames(normalizedIds)
  } catch {
    // Keep existing cart names usable when this optional enrichment is unavailable.
    return []
  }
}
