'use server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Post } from './post-schema.server'
import cloudinary from '@/server/cloudinary-config.server'
import { revalidateTag } from 'next/cache'
import { fetchTags } from '@/data/fetch-tags'

export async function createPost(
  formData: IPostLocal,
  image: string,
): Promise<IResponse> {
  try {
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

    revalidateTag(fetchTags.posts)
    revalidateTag(fetchTags.post)

    return { success: true, message: 'Post created' }
  } catch (error) {
    return {
      success: false,
      message: `Can't create post:  ${error}`,
    }
  }
}
