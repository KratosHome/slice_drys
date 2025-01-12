'use server'
import { connectToDb } from '@/server/connectToDb'
import { Post } from '@/server/posts/postSchema'
import cloudinary from '../cloudinaryConfig'

export async function deletePost(id: string) {
  try {
    await connectToDb()

    const postToDelete = await Post.findByIdAndDelete(id)
    if (!postToDelete) {
      return { success: false, message: "Product wasn't found" }
    }

    const { img } = postToDelete

    const publicIdMatch = img.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
    const publicId = publicIdMatch ? publicIdMatch[1] : null

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
      })
    }

    return { success: true, message: 'Post was deleted' }
  } catch (error) {
    return { success: false, message: "Can't delete post" }
  }
}
