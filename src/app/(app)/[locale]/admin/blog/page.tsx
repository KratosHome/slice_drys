import EditorPost from '@/components/admin/editor-post/editor-post'
import { PostList } from '@/components/admin/post-list/post-list'
import { getPosts } from '@/server/posts/get-posts.server'

export default async function Blog({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const posts1 = await getPosts(locale)
  console.log(111, posts1)

  const posts: IGetPost = {
    post: [
      {
        _id: '123',
        title: 'Приклад заголовка',
        content: 'Приклад змісту',
        img: 'https://res.cloudinary.com/dohos5iu3/image/upload/v1736238115/post-slice/w2mscmujmyyaiez7ouop.png',
        author: "Ім'я автора",
        slug: 'sample-title',
        metaDescription: 'Приклад мета опису',

        keywords: ['приклад', 'зразок'],
        visited: 0,
      },
      {
        _id: '123',
        title: 'Приклад заголовка',
        content: 'Приклад змісту',
        img: 'https://res.cloudinary.com/dohos5iu3/image/upload/v1736238115/post-slice/w2mscmujmyyaiez7ouop.png',
        author: "Ім'я автора",
        slug: 'sample-title',
        metaDescription: 'Приклад мета опису',

        keywords: ['приклад', 'зразок'],
        visited: 0,
      },
    ],
    success: true,
    message: 'Posts successfully retrieved',
  }
  return (
    <div className="px-5">
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-bold">Пости</h1>
        <EditorPost buttonTitle="створити" />
      </div>
      <PostList data={posts} />
    </div>
  )
}
