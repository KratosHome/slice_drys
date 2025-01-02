'use server'
import { connectToDb } from '@/server/connectToDb'
import { Post } from './postSchema'
import cloudinary from '@/server/cloudinaryConfig'

export async function createProduct(formData: IPostLocal, image: string) {
  'use server'
  try {
    await connectToDb()

    const upload = await cloudinary.uploader.upload(image, {
      folder: 'post-slice',
    })

    const postData = { ...formData, img: upload.secure_url }

    const post = new Post(postData)
    await post.save()

    return { success: true, message: 'Post created' }
  } catch (error) {
    return { success: false, message: "Can't create post" }
  }
}
