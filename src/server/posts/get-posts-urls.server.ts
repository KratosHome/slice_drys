'use server'

import { Post } from '@/server/posts/post-schema.server'
import { connectToDbServer } from '@/server/connect-to-db.server'

export interface PostSitemapEntry {
  slug: string
  updatedAt: Date
}

export async function getPostsUrls(): Promise<IResult<PostSitemapEntry>> {
  try {
    await connectToDbServer()

    const posts = await Post.find({})
      .select('slug updatedAt')
      .lean<PostSitemapEntry[]>()

    return {
      data: posts.map((post) => ({
        ...post,
        slug: post.slug.toLowerCase(),
      })),
      success: true,
      message: 'Posts retrieved',
    }
  } catch (error) {
    return {
      success: false,
      data: [],
      message: `Can't retrieve posts: ${error}`,
    }
  }
}
