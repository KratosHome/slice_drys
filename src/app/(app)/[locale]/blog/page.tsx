import { getPosts } from '@/server/posts/get-posts.server'
import Blog from '@/components/client/blog/blog'

export default async function Home(props: { params: Params }) {
  const { locale } = await props.params

  return (
    <main>
      <Blog locale={locale} />
    </main>
  )
}
