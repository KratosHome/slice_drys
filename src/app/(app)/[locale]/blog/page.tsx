import { getPosts } from '@/server/posts/get-posts.server'

export default async function Home(props: { params: Params }) {
  const { locale } = await props.params
  const posts = await getPosts(locale, 1, 8)

  return <main>{JSON.stringify(posts.post)}</main>
}
