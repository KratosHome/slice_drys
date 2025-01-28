import EditorPost from '@/components/admin/editor-post/editor-post'
import { PostList } from '@/components/admin/post-list/post-list'
import { getPosts } from '@/server/posts/get-posts.server'
import { getOrders } from '@/server/orders/get-orders'

export default async function Blog({
  params,
}: {
  params: Promise<{ locale: ILocale }>
}) {
  const { locale } = await params

  const posts = await getPosts({ locale })

  const orders = await getOrders(1, 1)
  console.log(111, orders)

  return (
    <div className="px-5">
      {JSON.stringify(orders)}
      <div className="flex items-end justify-between">
        <h1 className="text-xl font-bold">Пости</h1>
        <EditorPost buttonTitle="створити" />
      </div>
      <PostList data={posts} />
    </div>
  )
}
