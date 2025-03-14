'use server'

import { Product } from '@/server/products/productSchema'
import { fetchTags } from '@/data/fetch-tags'

import { connectToDb } from '@/server/connectToDb'
import cloudinary from '@/server/cloudinaryConfig'
import { revalidateTag } from 'next/cache'

export async function editProduct(
  id: string,
  formData: IProductLocal,
  image?: string,
): Promise<IResponse> {
  try {
    await connectToDb()

    const existingProduct = await Product.findById(id)

    if (!existingProduct) {
      return { success: false, message: 'Product not found' }
    }

    let imageUrl = existingProduct.img

    if (image) {
      const publicIdMatch = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
      const publicId = publicIdMatch ? publicIdMatch[1] : null

      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { invalidate: true })
      }

      const upload = await cloudinary.uploader.upload(image, {
        folder: 'products-slice',
      })

      imageUrl = upload.secure_url
    }

    const updatedData: IProductLocal = {
      ...formData,
      img: imageUrl,
    }

    await Product.findByIdAndUpdate(id, updatedData, { new: true })

    revalidateTag(fetchTags.products)
    revalidateTag(fetchTags.product)

    return { success: true, message: 'Product updated successfully' }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Can't update product" }
  }
}
