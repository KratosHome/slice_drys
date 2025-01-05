'use server'
import { connectToDb } from '@/server/connectToDb'
import { Post } from './postSchema'
import cloudinary from '@/server/cloudinaryConfig'

export async function createPost(formData: IPostLocal, image?: string) {
  'use server'
  try {
    await connectToDb()
    console.log(1111, image)

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
    console.log(postData)
    const post = new Post(postData)
    await post.save()
    console.log('Post created')

    return { success: true, message: 'Post created' }
  } catch (error) {
    console.error('Error creating post:', error)
    return { success: false, message: "Can't create post" }
  }
}
