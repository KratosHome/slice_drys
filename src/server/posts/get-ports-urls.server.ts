import { connectToDb } from '@/server/connectToDb'
import { Post } from '@/server/posts/postSchema'

export async function getPostsUrls() {
  try {
    await connectToDb()

    const posts = await Post.find({}).select('slug').lean()

    const postsWithLowercaseSlug = posts.map((items) => ({
      ...items,
      slug: items.slug.toLowerCase(),
    }))

    return {
      data: postsWithLowercaseSlug,
      success: true,
      message: 'Categories retrieved',
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      message: `Can't retrieve categories: ${error}`,
    }
  }
}
