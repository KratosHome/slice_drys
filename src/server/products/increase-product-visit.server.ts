'use server'
import { connectToDb } from '@/server/connectToDb'
import { Product } from '@/server/products/productSchema'

export async function increaseProductVisit(slug: string) {
  'use server'
  try {
    await connectToDb()

    await Product.findOneAndUpdate(
      { slug },
      { $inc: { visited: 1 } },
      { new: true },
    )

    return { success: true, message: 'Visited product' }
  } catch (error) {
    return { success: false, message: `Can't create product ${error}` }
  }
}
