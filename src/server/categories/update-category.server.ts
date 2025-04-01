'use server'

import { Category } from '@/server/categories/categories-schema'
import { fetchTags } from '@/data/fetch-tags'

import { connectToDb } from '@/server/connectToDb'
import cloudinary from '@/server/cloudinaryConfig'
import { revalidateTag } from 'next/cache'

type UpdateCategoryDTO = Partial<Omit<ICategory, '_id' | 'children'>>

export async function updateCategory(
  categoryId: string,
  categoryData: UpdateCategoryDTO,
  image?: string,
) {
  try {
    await connectToDb()

    const existingCategory = await Category.findById(categoryId)

    if (!existingCategory) {
      return { success: false, message: 'Категорію не знайдено' }
    }

    let imageUrl = existingCategory.image

    if (image) {
      const publicIdMatch = imageUrl?.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
      const publicId = publicIdMatch ? publicIdMatch[1] : null

      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { invalidate: true })
      }

      const upload = await cloudinary.uploader.upload(image, {
        folder: 'categories',
      })

      imageUrl = upload.secure_url
    }

    const updatedData = {
      ...categoryData,
      image: imageUrl,
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updatedData,
      {
        new: true,
        runValidators: true,
      },
    )

    if (!updatedCategory) {
      return { success: false, message: 'Категорію не знайдено' }
    }

    revalidateTag(fetchTags.menu)
    revalidateTag(fetchTags.products)

    return {
      data: updatedCategory,
      success: true,
      message: 'Категорію оновлено успішно',
    }
  } catch (error) {
    return {
      success: false,
      message: `Помилка при оновленні категорії: ${error}`,
    }
  }
}
