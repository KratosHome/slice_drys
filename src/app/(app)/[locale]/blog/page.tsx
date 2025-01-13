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

export default async function Blog({ params, searchParams }: Props) {
  const { locale } = params
  const page = parseInt(searchParams.page || '1', 10)
  const postsOnPage = 8
  const data = await getPosts(locale, page, postsOnPage)
  const pageCount = Math.ceil(data.totalPosts / postsOnPage)

  return <RenderContent locale={locale} page={page} data={data} />
}

function RenderContent({
  locale,
  page,
  data,
}: {
  locale: string
  page: number
  data: any
}) {
  const breadCrumbsTranslation = useTranslations('Breadcrumbs')
  const blogTranslation = useTranslations('Blog')

  return (
    <main className="mx-auto max-w-[1280px]">
      <div className="mt-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                {breadCrumbsTranslation('Home')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/blog`}>
                {breadCrumbsTranslation('Blog')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {' '}
                {breadCrumbsTranslation('Page') + ' ' + page}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex">
        <div className="mb-10 mt-10 flex justify-between">
          <div className="flex w-full flex-wrap justify-between">
            <div className="flex w-[100%] sm:w-[34%]">
              <div
                className="w-[100%] text-[128px]"
                style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
              >
                {blogTranslation('Blog')}
              </div>
            </div>

            <div className="flex w-[100%] sm:w-[65%]">
              <div className="flex h-min w-full items-center justify-center bg-black p-5 text-left font-poppins text-xl text-white drop-shadow-[16px_16px_0px_#A90909]">
                {blogTranslation('title')}
              </div>
            </div>
          </div>
        </div>
        <div className="my-4 border-t border-dashed border-black"></div>
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
