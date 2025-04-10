'use server'
import { revalidateTag } from 'next/cache'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Post } from '@/server/posts/post-schema.server'
import cloudinary from '@/server/cloudinary-config.server'
import { fetchTags } from '@/data/fetch-tags'

export async function editPostServer(
  id: string,
  formData: IPostLocal,
  image?: string,
): Promise<IResponse> {
  'use server'
  try {
    await connectToDbServer()

    const existingPost = await Post.findById(id)

    if (!existingPost) return { success: false, message: 'Post not found' }

    let imageUrl = existingPost.img

    if (image) {
      const publicIdMatch = imageUrl.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
      const publicId = publicIdMatch ? publicIdMatch[1] : null

      if (publicId) {
        await cloudinary.uploader.destroy(publicId, { invalidate: true })
      }

      const upload = await cloudinary.uploader.upload(image, {
        folder: 'post-slice',
      })

      imageUrl = upload.secure_url
    }

    const updatedData = {
      ...formData,
      img: imageUrl,
    }

    await Post.findByIdAndUpdate(id, updatedData, { new: true })

    revalidateTag(fetchTags.posts)
    revalidateTag(fetchTags.post)

    return { success: true, message: 'Post updated successfully' }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Can't update product" }
  }
}
