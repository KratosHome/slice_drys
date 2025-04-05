'use server'

import { Post } from '@/server/posts/postSchema'
import { fetchTags } from '@/data/fetch-tags'

import { connectToDb } from '@/server/connectToDb'
import cloudinary from '@/server/cloudinaryConfig'
import { revalidateTag } from 'next/cache'

export async function createPost(
  formData: IPostLocal,
  image: string,
): Promise<IResponse> {
  try {
    await connectToDb()

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
