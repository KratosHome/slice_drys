import { getPosts } from '@/server/posts/get-posts.server'
import PostList from '@/components/client/blog/post-list'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/client/ui/pagination'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/client/ui/breadcrumbs'
import { useTranslations } from 'next-intl'

type Props = {
  params: { locale: string }
  searchParams: { page?: string }
}

// Основна асинхронна функція для отримання даних блогу
export default async function Blog({ params, searchParams }: Props) {
  const { locale } = params
  const page = parseInt(searchParams.page || '1', 10)
  const data = await getPosts(locale, page, 8) // Отримати пости асинхронно

  return <RenderContent locale={locale} page={page} data={data} /> // Виклик компонента
}

// Компонент React, що відображає контент
function RenderContent({
  locale,
  page,
  data,
}: {
  locale: string
  page: number
  data: any
}) {
  const t = useTranslations('Breadcrumbs')

  return (
    <main className="max-w-[1280px]">
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
              <BreadcrumbPage> {page}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="mx-auto flex flex-col items-center">
        <PostList posts={data.post} />
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href={`?page=${page > 1 ? page - 1 : 1}`} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href={`?page=${page}`}>{page}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href={`?page=${page + 1}`} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </main>
  )
}
