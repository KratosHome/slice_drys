'use server'
import { connectToDb } from '@/server/connectToDb'
import { Post } from '@/server/posts/postSchema'
import cloudinary from '../cloudinaryConfig'
import { revalidateTag } from 'next/cache'
import { fetchTags } from '@/data/fetch-tags'

export async function deletePost(id: string) {
  try {
    await connectToDb()

    const postToDelete = await Post.findByIdAndDelete(id)
    if (!postToDelete) {
      return { success: false, message: "Post wasn't found" }
    }

    const { img } = postToDelete

    const publicIdMatch = img.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/)
    const publicId = publicIdMatch ? publicIdMatch[1] : null

    if (publicId) {
      await cloudinary.uploader.destroy(publicId, {
        invalidate: true,
      })
    }

    revalidateTag(fetchTags.posts)
    revalidateTag(fetchTags.post)
    return { success: true, message: 'Post was deleted' }
  } catch (error) {
    return { success: false, message: "Can't delete post" + error }
  }
}
