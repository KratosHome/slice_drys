'use server'
import { connectToDb } from '@/server/connectToDb'
import Block from '@/server/block/blocks-schema'
import cloudinary from '@/server/cloudinaryConfig'
import { revalidateTag } from 'next/cache'
import { fetchTags } from '@/data/fetch-tags'

export async function updateHelpData(
  formData: Omit<IHelp, 'images'>,
  images: string[],
) {
  'use server'
  try {
    await connectToDb()
    const block = await Block.findOne()

    if (block && block.images?.length) {
      const deletePromises = block.images.map((url: string) => {
        const publicId = url.split('/').slice(-2).join('/').split('.')[0]
        return cloudinary.uploader.destroy(publicId, { invalidate: true })
      })

      await Promise.all(deletePromises)
    }

    const uploadPromises = images.map((image) =>
      cloudinary.uploader.upload(image, {
        folder: 'help-slice',
      }),
    )
    const uploads = await Promise.all(uploadPromises)

    const secureUrls = uploads.map((upload) => upload.secure_url)

    const helpData = { ...formData, images: secureUrls }

    if (block) {
      block.help = helpData
      await block.save()
    } else {
      await Block.create({ help: helpData })
    }

    revalidateTag(fetchTags.helpMain)

    return {
      success: true,
      message: 'Дані успішно оновлено',
    }
  } catch (error) {
    return {
      success: false,
      message: `Помилка: ${error}`,
    }
  }
}
