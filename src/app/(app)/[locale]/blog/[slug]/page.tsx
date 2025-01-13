import { getPostBySlug } from '@/server/posts/get-posts.server'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

export default async function PostPage({
  params,
}: {
  params: { slug: string; locale: string }
}) {
  const { slug, locale } = params

  const data: IGetOnePost = await getPostBySlug(locale, slug)

  const content = JSON.parse(data.post.content)

  const converter = new QuillDeltaToHtmlConverter(content.ops)
  const html = converter.convert()

  return (
    <div className="mx-auto flex max-w-[1280px] flex-col items-center">
      <h1 dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}
