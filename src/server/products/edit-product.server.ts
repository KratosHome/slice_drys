'use server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Product } from '@/server/products/product-schema.server'
import cloudinary from '@/server/cloudinary-config.server'
import { fetchTags } from '@/data/fetch-tags'
import { revalidateTag } from 'next/cache'

export async function editProduct(
  id: string,
  formData: IProductLocal,
  image?: string,
) {
  'use server'
  try {
    await connectToDbServer()

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

    revalidateTag(fetchTags.products)
    revalidateTag(fetchTags.product)

    return { success: true, message: 'Product updated successfully' }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Can't update product" }
  }
}
