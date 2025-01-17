import { getPosts } from '@/server/posts/get-posts.server'
import PostList from '@/components/client/blog/post-list'
import BlogTitle from '@/components/client/ui/blog-title'

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

type Props = {
  params: { locale: string }
  searchParams: { page?: string }
}

export default async function Blog({ params, searchParams }: Props) {
  const { locale } = params
  const page = parseInt(searchParams.page || '1', 10)
  const limit = 8
  const data = await getPosts({ locale, page, limit })
  const countOfPages = Math.ceil(data.totalPosts / limit)

  return (
    <div className="mx-auto max-w-[1280px] p-5">
      <div className="mt-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" localizationKey="Home"></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/${locale}/blog`}
                localizationKey="Blog"
              ></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage localizationKey="Page">{page}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <BlogTitle />
      <div className="mx-auto flex flex-col items-center">
        <PostList posts={data.post} />
        <Pagination>
          <PaginationContent className="m-10">
            <PaginationItem>
              <PaginationPrevious
                size={'default'}
                className={`${page === 1 ? 'pointer-events-none opacity-50' : ''}`}
                href={`?page=${page > 1 ? page - 1 : 1}`}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                size={'default'}
                className="mx-5"
                href={`?page=${page}`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                size={'default'}
                className={`${page === countOfPages ? 'pointer-events-none opacity-50' : ''}`}
                href={`?page=${page + 1}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
