'use server'
import { connectToDb } from '@/server/connectToDb'
import { Post } from './postSchema'
import cloudinary from '@/server/cloudinaryConfig'

export async function createPost(formData: IPostLocal, image?: string) {
  'use server'
  try {
    await connectToDb()

    let imageUrl = ''
    if (image) {
      const upload = await cloudinary.uploader.upload(image, {
        folder: 'post-slice',
      })
      imageUrl = upload.secure_url
    }

    const postData = {
      ...formData,
      img: imageUrl,
    }
    const post = new Post(postData)
    await post.save()
    return { success: true, message: 'Post created' }
  } catch (error) {
    return {
      success: false,
      message: `Can't create post:  ${error}`,
    }
  }
}
