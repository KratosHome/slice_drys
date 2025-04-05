'use server'

import { Post } from '@/server/posts/postSchema'

import { connectToDb } from '@/server/connectToDb'

interface IGetPostsOptions {
  locale: ILocale
  page: number
  limit: number
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

const formatPost = (post: IPostLocal, locale: ILocale): IPost => ({
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

export async function getPosts({ locale, page, limit }: IGetPostsOptions) {
  'use server'
  try {
    await connectToDb()

    const skip: number = (page - 1) * limit

    const [posts, totalPostsCount] = await Promise.all([
      Post.find({}, getSelectedFields(locale))
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<IPostLocal[]>(),
      Post.countDocuments(),
    ])

    return {
      postsLocalized: posts.map((post: IPostLocal) => formatPost(post, locale)),
      currentPage: page,
      totalPages: Math.ceil(totalPostsCount / limit),
      totalPosts: totalPostsCount,
      success: true,
      message: 'Posts retrieved',
    }
  } catch (error) {
    return {
      success: false,
      message: `Can't retrieve posts ${JSON.stringify(error, null, 2)}`,
      postAll: [],
      post: [],
      totalPosts: 0,
    }
  }
}

type GetAllPostsOptions = {
  locale: ILocale
}

export async function getAllPosts({ locale }: GetAllPostsOptions) {
  'use server'
  try {
    await connectToDb()

    const allPosts = await Post.find()
      .sort({ createdAt: -1 })
      .lean<IPostLocal[]>()

    return {
      success: true,
      postsLocalized: allPosts.map((post: IPostLocal) =>
        formatPost(post, locale),
      ),
      postsAll: allPosts.map((post) => ({
        ...post,
        _id: post._id?.toString(),
      })),
      message: 'Posts retrieved',
    }
  } catch (error) {
    return {
      success: false,
      message: `Can't retrieve posts ${JSON.stringify(error, null, 2)}`,
      postsAll: [],
      postsLocalized: [],
    }
  }
}

type GetPostOptions = {
  locale: ILocale
  slug: string
  isVisited?: boolean
}

export async function getPost({ locale, slug, isVisited }: GetPostOptions) {
  'use server'
  try {
    await connectToDb()

    const post: IPostLocal | null = isVisited
      ? ((await Post.findOneAndUpdate(
          { slug },
          { $inc: { visited: 1 } },
          { new: true, select: getSelectedFields(locale) },
        )
          .sort({ createdAt: -1 })
          .lean()) as IPostLocal | null)
      : ((await Post.findOne(
          { slug },
          getSelectedFields(locale),
        ).lean()) as IPostLocal | null)

    if (!post) return { success: false, post: [], message: 'Post not found' }

    return {
      success: true,
      post: [formatPost(post, locale)],
      totalPosts: 0,
      message: 'Post retrieved',
    }
  } catch (error) {
    return {
      success: false,
      postAll: [],
      post: [],
      totalPosts: 0,
      message: `Can't retrieve post ${JSON.stringify(error, null, 2)}`,
    }
  }
}
