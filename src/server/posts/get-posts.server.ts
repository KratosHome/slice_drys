'use server'
import { connectToDb } from '@/server/connectToDb'
import { Post } from '@/server/posts/postSchema'

export async function getPosts(locale: string, page?: number, limit?: number) {
  try {
    await connectToDb()

    const pagination = page && limit ? { skip: (page - 1) * limit, limit } : {}

    const postQuery = Post.find()
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

    // Підраховуємо загальну кількість постів
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
      totalPosts: totalPostsCount, // Додаємо загальну кількість постів
      message: 'Products retrieved',
    }
  } catch (error) {
    return {
      success: false,
      post: [],
      postAll: [],
      totalPosts: 0, // Повертаємо 0 у випадку помилки
      message: "Can't retrieve posts" + { error },
    }
  }
}

export async function getPostBySlug(locale: string, slug: string) {
  try {
    await connectToDb()

    const postQuery = Post.findOne({ slug: slug })
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

    const post = (await postQuery) as any
    if (!post) {
      throw new Error('Пост не знайдено')
    }

    const formattedPost: IPost = {
      _id: (post._id as string).toString(),
      slug: post.slug, // Ця властивість обов'язкова
      img: post.img,
      title: post.title[locale], // Отримуємо дані з врахуванням локалі
      content: post.content[locale],
      author: post.author[locale],
      metaDescription: post.metaDescription[locale],
      keywords: post.keywords[locale], // Переконаємося, що це масив
      visited: post.visited,
      updatedAt: post.updatedAt.$date ? post.updatedAt.$date : post.updatedAt, // Беремо дату
    }

    return {
      success: true,
      post: formattedPost,
      message: 'Products retrieved',
    }
  } catch (error) {
    return {
      success: false,
      post: null as unknown as IPost,
      message: "Can't retrieve post" + { error },
    }
  }
}
