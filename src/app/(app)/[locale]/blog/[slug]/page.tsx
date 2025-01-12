// Імпорти
import { getPostBySlug } from '@/server/posts/get-posts.server'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html' // Імпортуємо бібліотеку

export default async function PostPage({
  params,
}: {
  params: { slug: string }
}) {
  const slug = params.slug

  const data: IGetOnePost = await getPostBySlug('uk', slug)

  const content = data.post.content

  const converter = new QuillDeltaToHtmlConverter(content.ops)
  const html = converter.convert()

  return (
    <div>
      <h1 dangerouslySetInnerHTML={{ __html: html }} /> {/* Вставляємо HTML */}
    </div>
  )
}
