'use server'
import { revalidateTag } from 'next/cache'
import { connectToDb } from '@/server/connectToDb'
import { Post } from '@/server/posts/postSchema'
import cloudinary from '@/server/cloudinaryConfig'

export async function editPost(
  id: string,
  formData: IPostLocal,
  image?: string,
) {
  'use server'
  try {
    await connectToDb()

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
    revalidateTag('posts')
    return { success: true, message: 'Post updated successfully' }
  } catch (error) {
    console.error(error)
    return { success: false, message: "Can't update product" }
  }
}
