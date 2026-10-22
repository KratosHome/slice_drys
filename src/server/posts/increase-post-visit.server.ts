'use server'

import { connectToDbServer } from '@/server/connect-to-db.server'
import { Post } from '@/server/posts/post-schema.server'

export async function increasePostVisit(slug: string): Promise<IResponse> {
  if (typeof slug !== 'string' || !slug.trim()) {
    return { success: false, message: 'Invalid post slug' }
  }

  try {
    await connectToDbServer()

    const result = await Post.updateOne(
      { slug: slug.trim().toLowerCase() },
      { $inc: { visited: 1 } },
      // A visit must not change the article date or sitemap freshness.
      { timestamps: false },
    )

    if (!result.matchedCount) {
      return { success: false, message: 'Post not found' }
    }

    return { success: true, message: 'Visited post' }
  } catch (error) {
    console.error('Post visit tracking failed', error)
    return { success: false, message: 'Unable to record post visit' }
  }
}
