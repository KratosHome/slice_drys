'use server'
import { connectToDb } from '@/server/connectToDb'
import { Product } from '@/server/products/productSchema'
import cloudinary from '@/server/cloudinaryConfig'
import { fetchTags } from '@/data/fetch-tags'
import { revalidateTag } from 'next/cache'

export async function createProduct(formData: IProductLocal, image: string) {
  'use server'
  try {
    await connectToDb()

    const upload = await cloudinary.uploader.upload(image, {
      folder: 'products-slice',
    })

    const productData = { ...formData, img: upload.secure_url }

    const product = new Product(productData)
    await product.save()

    revalidateTag(fetchTags.products)
    revalidateTag(fetchTags.product)

    return { success: true, message: 'Product created' }
  } catch (error) {
    return { success: false, message: `Can't create product ${error}` }
  }
}
