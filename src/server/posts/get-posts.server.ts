'use server'
import { connectToDb } from '@/server/connectToDb'
import { Post } from '@/server/posts/postSchema'

type GetPostsOptions = {
  locale: ILocale
  slug?: string
  page?: number
  limit?: number
  isVisited?: boolean
}

const getSelectedFields = (locale: ILocale) => ({
  [`title.${locale}`]: 1,
  [`content.${locale}`]: 1,
  [`author.${locale}`]: 1,
  [`metaDescription.${locale}`]: 1,
  [`keywords.${locale}`]: 1,
  img: 1,
  slug: 1,
  visited: 1,
  updatedAt: 1,
  createdAt: 1,
})

const formatPost = (post: IPostLocal, locale: ILocale) => ({
  _id: post._id?.toString(),
  slug: post.slug,
  img: post.img,
  title: post.title[locale],
  content: post.content[locale],
  author: post.author[locale],
  metaDescription: post.metaDescription[locale],
  keywords: post.keywords[locale],
  visited: post.visited,
  updatedAt: post.updatedAt,
  createdAt: post.createdAt,
})

export async function getPosts({
  locale,
  slug,
  page,
  limit,
  isVisited,
}: GetPostsOptions) {
  try {
    await connectToDb()

    if (slug) {
      const post: IPostLocal | null = isVisited
        ? ((await Post.findOneAndUpdate(
            { slug },
            { $inc: { visited: 1 } },
            { new: true, select: getSelectedFields(locale) },
          ).lean()) as IPostLocal | null)
        : ((await Post.findOne(
            { slug },
            getSelectedFields(locale),
          ).lean()) as IPostLocal | null)

      if (!post) return { success: false, post: [], message: 'Post not found' }

      return {
        success: true,
        post: [formatPost(post, locale)],
        totalPosts: 0,
        message: 'Products retrieved',
      }
    }

    const pagination = page && limit ? { skip: (page - 1) * limit, limit } : {}

    const [posts, totalPostsCount] = await Promise.all([
      Post.find({}, getSelectedFields(locale))
        .sort({ createdAt: -1 })
        .skip(pagination.skip ?? 0)
        .limit(pagination.limit ?? 0)
        .lean<IPostLocal[]>(),
      Post.countDocuments(),
      Post.find().sort({ createdAt: -1 }).lean<IPostLocal[]>(),
    ])

    return {
      success: true,
      post: posts.map((p: IPostLocal) => formatPost(p, locale)),
      totalPosts: totalPostsCount,
      message: 'Products retrieved',
    }
  } catch (error) {
    return {
      success: false,
      post: [],
      totalPosts: 0,
      message: `Can't retrieve posts ${error}`,
    }
  }
}
