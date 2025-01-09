import { connectToDb } from '@/server/connectToDb'
import { Post } from '@/server/posts/postSchema'

export async function getPosts(locale: string) {
  'use server'
  try {
    await connectToDb()
    const query: Record<string, any> = {}
    const posts = await Post.find(query).select({
      [`title.${locale}`]: 1,
    })

    return { posts }
  } catch (error) {
    return {
      message: "Can't retrieve posts",
    }
  }
}
