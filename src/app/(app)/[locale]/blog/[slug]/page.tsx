import { getPostBySlug } from '@/server/posts/get-posts.server'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { notFound } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/client/ui/breadcrumbs'
import { useTranslations } from 'next-intl' // Імпорт функції перекладу

export default async function PostPage({
  params,
}: {
  params: { slug: string; locale: string }
}) {
  const { slug, locale } = params

  const data: IGetOnePost = await getPostBySlug(locale, slug)
  if (!data.success) {
    return notFound()
  }
  const content = JSON.parse(data.post.content)

  const converter = new QuillDeltaToHtmlConverter(content.ops)
  const html = converter.convert()

  return <RenderContent locale={locale} data={data} html={html} />
}

function RenderContent({
  locale,
  data,
  html,
}: {
  locale: string
  data: any
  html: string
}) {
  const t = useTranslations('Breadcrumbs') // Використання функції перекладу

  return (
    <main className="mx-auto max-w-[1280px]">
      <div className="mt-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">{t('Home')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/blog`}>
                {t('Blog')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{data.post.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-col items-center">
        <h1 dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </main>
  )
}
