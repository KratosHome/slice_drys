'use server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Post } from './post-schema.server'
import cloudinary from '@/server/cloudinary-config.server'
import { revalidateTag } from 'next/cache'
import { fetchTags } from '@/data/fetch-tags'
import { requirePermission } from '@/server/auth/require-admin.server'
import { ApiError } from '@/server/api-error.server'

export async function createPost(
  formData: IPostLocal,
  image: string,
): Promise<IResponse> {
  try {
    await requirePermission('blog:manage')
    await connectToDbServer()

    let postData = {
      ...formData,
    }

    let imageUrl: string = ''

    if (image) {
      const upload = await cloudinary.uploader.upload(image, {
        folder: 'post-slice',
      })

      imageUrl = upload.secure_url

      postData = {
        ...formData,
        img: imageUrl,
      }
    }

    const post = new Post(postData)
    await post.save()

    revalidateTag(fetchTags.posts, 'max')
    revalidateTag(fetchTags.post, 'max')

    return { success: true, message: 'Post created' }
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

    console.error('Admin post creation failed', error)

    return {
      success: false,
      message: 'Не вдалося створити пост',
    }
  }
}
