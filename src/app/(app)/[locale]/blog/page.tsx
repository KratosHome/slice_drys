import { getPosts } from '@/server/posts/get-posts.server'
import Blog from '@/components/client/blog/blog'

// let page = 1 // Ініціалізація змінної page значенням 1 або іншим початковим значенням

// const posts = await (await getPosts(locale, page, 8)).post

// const setPage = async (newPage: number) => {
//   page = newPage // Оновлення значення змінної page
//   return await getPosts(locale, page, 8).post
// }

export default async function Home(props: { params: Params }) {
  const { locale } = await props.params

  return (
    <main>
      <Blog locale={locale} />
    </main>
  )
}
