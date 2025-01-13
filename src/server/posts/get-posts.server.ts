import { connectToDb } from '@/server/connectToDb'
import { Post } from '@/server/posts/postSchema'

export async function getPosts(locale: string) {
  'use server'
  try {
    await connectToDb()

    const post = await Post.find()
      .select({
        [`title.${locale}`]: 1,
        [`content.${locale}`]: 1,
        img: 1,
        [`author.${locale}`]: 1,
        slug: 1,
        [`metaDescription.${locale}`]: 1,
        [`keywords.${locale}`]: 1,
        visited: 1,
      })
      .lean()

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
      message: 'Products retrieved',
    }
  } catch (error) {
    return {
      success: false,
      post: [],
      postAll: [],
      message: "Can't retrieve posts",
    }
  }
}
