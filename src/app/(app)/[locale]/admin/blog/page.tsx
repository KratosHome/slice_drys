import EditorPost from '@/components/admin/editor-post/editor-post'
import { PostList } from '@/components/admin/post-list/post-list'

import { getAllPosts } from '@/server/posts/get-posts.server'

export default async function Blog({
  params,
}: {
  params: Promise<{ locale: ILocale }>
}) {
  const { locale } = await params

  const posts = await getAllPosts({ locale })

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
