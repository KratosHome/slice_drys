import { connectToDb } from '@/server/connectToDb'
import { Post } from '@/server/posts/postSchema'

export async function getPostsUrls() {
  try {
    await connectToDb()

    const posts = await Post.find({}).select('slug').lean()

    const postsWithLowercaseSlug = posts.map((item) => ({
      ...item,
      slug: item.slug.toLowerCase(),
    }))

    return {
      data: postsWithLowercaseSlug,
      success: true,
      message: 'Posts URLs retrieved',
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      message: `Can't retrieve posts URLs: ${error}`,
    }
  }
}
