'use server'
import { connectToDb } from '@/server/connectToDb'
import { Post } from './postSchema'
import cloudinary from '@/server/cloudinaryConfig'
import { revalidateTag } from 'next/cache'
import { fetchTags } from '@/data/fetch-tags'

export async function createPost(formData: IPostLocal, image: string) {
  'use server'
  try {
    await connectToDb()

    let postData = {
      ...formData,
    }
    let imageUrl = ''
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
