import { getPostBySlug } from '@/server/posts/get-posts.server'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

export default async function PostPage({
  params,
}: {
  params: { slug: string; locale: string }
}) {
  const { slug, locale } = params // Деструктуруємо slug і locale з params

  const data: IGetOnePost = await getPostBySlug(locale, slug)

  const content = JSON.parse(data.post.content) // Перетворюємо із JSON-рядка в об'єкт

  const converter = new QuillDeltaToHtmlConverter(content.ops) // Передаємо Delta об'єкт
  const html = converter.convert()

  return (
    <div>
      <h1 dangerouslySetInnerHTML={{ __html: html }} /> {/* Вставляємо HTML */}
    </div>
  )
}
