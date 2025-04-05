'use server'

import { Product } from '@/server/products/productSchema'
import { fetchTags } from '@/data/fetch-tags'

import { connectToDb } from '@/server/connectToDb'
import cloudinary from '@/server/cloudinaryConfig'
import { revalidateTag } from 'next/cache'

export async function createProduct(
  formData: IProductLocal,
  image: string,
): Promise<IResponse> {
  try {
    await connectToDb()

    const upload = await cloudinary.uploader.upload(image, {
      folder: 'products-slice',
    })

    const productData: IProductLocal = { ...formData, img: upload.secure_url }

    const product = new Product(productData)
    await product.save()

    revalidateTag(fetchTags.products)
    revalidateTag(fetchTags.product)

    return { success: true, message: 'Product created' }
  } catch (error) {
    return { success: false, message: `Can't create product ${error}` }
  }
}
