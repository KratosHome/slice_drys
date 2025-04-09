'use server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Post } from '@/server/posts/post-schema.server'

export async function getPostsUrls() {
  'use server'
  try {
    await connectToDbServer()

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
