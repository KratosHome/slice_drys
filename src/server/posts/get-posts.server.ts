'use server'
import { connectToDb } from '@/server/connectToDb'
import { Post } from '@/server/posts/postSchema'

type GetPostsOptions = {
  locale: string
  slug?: string
  page?: number
  limit?: number
}

export async function getPosts({ locale, slug, page, limit }: GetPostsOptions) {
  try {
    await connectToDb()

    if (slug) {
      const postQuery = Post.findOneAndUpdate(
        { slug: slug },
        { $inc: { visited: 1 } },
        {
          new: true,
          select: {
            [`title.${locale}`]: 1,
            [`content.${locale}`]: 1,
            img: 1,
            [`author.${locale}`]: 1,
            slug: 1,
            [`metaDescription.${locale}`]: 1,
            [`keywords.${locale}`]: 1,
            visited: 1,
            updatedAt: 1,
          },
        },
      ).lean()

      const post = (await postQuery) as Any
      if (!post) {
        throw new Error('Пост не знайдено')
      }

      const formattedPost: IPost[] = [
        {
          _id: (post._id as string).toString(),
          slug: post.slug,
          img: post.img,
          title: post.title[locale],
          content: post.content[locale],
          author: post.author[locale],
          metaDescription: post.metaDescription[locale],
          keywords: post.keywords[locale],
          visited: post.visited,
          updatedAt: post.updatedAt.$date
            ? post.updatedAt.$date
            : post.updatedAt,
        },
      ]

      return {
        success: true,
        post: formattedPost,
        postAll: [],
        totalPosts: 0,
        message: 'Products retrieved',
      }
    }

    const pagination = page && limit ? { skip: (page - 1) * limit, limit } : {}

    const postQuery = Post.find()
      .sort({ createdAt: -1 })
      .select({
        [`title.${locale}`]: 1,
        [`content.${locale}`]: 1,
        img: 1,
        [`author.${locale}`]: 1,
        slug: 1,
        [`metaDescription.${locale}`]: 1,
        [`keywords.${locale}`]: 1,
        visited: 1,
        updatedAt: 1,
      })
      .lean()

    if (pagination.skip !== undefined && pagination.limit !== undefined) {
      postQuery.skip(pagination.skip).limit(pagination.limit)
    }

    const totalPostsCount = await Post.countDocuments()

    const post = await postQuery

    const formattedPost: IPost[] = post.map((post) => ({
      ...post,
      _id: (post._id as string).toString(),
      slug: post.slug,
      img: post.img,
      title: post.title[locale],
      content: post.content[locale],
      author: post.author[locale],
      metaDescription: post.metaDescription[locale],
      keywords: post.keywords[locale],
      updatedAt: post.updatedAt.$date ? post.updatedAt.$date : post.updatedAt,
    }))

    const allPost: IPostLocal[] = (await Post.find()
      .sort({ createdAt: -1 })
      .lean()) as unknown as IPostLocal[]

    const formattedAllPost = allPost.map((post) => ({
      ...post,
      _id: (post._id as string).toString(),
    }))

    return {
      success: true,
      post: formattedPost,
      postAll: formattedAllPost,
      totalPosts: totalPostsCount,
      message: 'Products retrieved',
    }
  } catch (error) {
    return {
      success: false,
      post: [],
      postAll: [],
      totalPosts: 0,
      message: "Can't retrieve posts" + { error },
    }
  }
}
