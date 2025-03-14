'use server'

import { Product } from '@/server/products/productSchema'
import { fetchTags } from '@/data/fetch-tags'

import { connectToDb } from '@/server/connectToDb'
import cloudinary from '../cloudinaryConfig'
import { revalidateTag } from 'next/cache'

export async function deleteProduct(id?: string): Promise<IResponse> {
  try {
    await connectToDb()

    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) {
      return { success: false, message: "Product wasn't found" }
    }

    const { img } = deletedProduct

    const publicIdMatch = img.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
    const publicId = publicIdMatch ? publicIdMatch[1] : null

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
      })
    }

    revalidateTag(fetchTags.products)
    revalidateTag(fetchTags.product)

    return { success: true, message: 'Product was deleted' }
  } catch (error) {
    return { success: false, message: `Can't delete product ${error}` }
  }
}
