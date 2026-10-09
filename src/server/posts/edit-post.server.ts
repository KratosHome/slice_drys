'use server'
import { revalidateTag } from 'next/cache'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Post } from '@/server/posts/post-schema.server'
import cloudinary from '@/server/cloudinary-config.server'
import { fetchTags } from '@/data/fetch-tags'
import { requirePermission } from '@/server/auth/require-admin.server'
import { ApiError } from '@/server/api-error.server'

export async function editPostServer(
  id: string,
  formData: IPostLocal,
  image?: string,
): Promise<IResponse> {
  'use server'
  try {
    await requirePermission('blog:manage')
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

    revalidateTag(fetchTags.posts, 'max')
    revalidateTag(fetchTags.post, 'max')

    return { success: true, message: 'Post updated successfully' }
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      return { success: false, message: 'Сеанс завершився. Увійдіть знову.' }
    }

    if (error instanceof ApiError && error.statusCode === 403) {
      return {
        success: false,
        message: 'Недостатньо прав для керування блогом.',
      }
    }

    console.error('Admin post update failed', error)
    return { success: false, message: 'Не вдалося оновити пост' }
  }
}
