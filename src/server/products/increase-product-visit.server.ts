'use server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Product } from '@/server/products/product-schema.server'
import { findByProductSlug } from '@/utils/product-slug'

export async function increaseProductVisit(slug: string) {
  'use server'
  try {
    await connectToDbServer()

    await findByProductSlug(slug, (matchedSlug) =>
      Product.findOneAndUpdate(
        { slug: matchedSlug },
        { $inc: { visited: 1 } },
        // Analytics must not change the content freshness used by sitemap.xml.
        { new: false, timestamps: false },
      ),
    )

    return { success: true, message: 'Visited product' }
  } catch (error) {
    return { success: false, message: `Can't create product ${error}` }
  }
}
