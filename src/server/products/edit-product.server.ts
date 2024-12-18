'use server'
import { connectToDb } from '@/server/connectToDb'
import { Product } from '@/server/products/productSchema'
import cloudinary from '@/server/cloudinaryConfig'
import { IProductLocal } from '@/types/product'

export async function editProduct(
  id: string,
  formData: IProductLocal,
  image?: string,
) {
  'use server'
  try {
    await connectToDb()

    const existingProduct = await Product.findById(id)
    if (!existingProduct)
      return { success: false, message: 'Product not found' }

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

    const updatedData = {
      ...formData,
      img: imageUrl,
    }

    await Product.findByIdAndUpdate(id, updatedData, { new: true })

    return { success: true, message: 'Product updated successfully' }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Can't update product" }
  }
}
