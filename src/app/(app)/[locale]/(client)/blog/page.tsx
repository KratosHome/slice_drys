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
    <main className="mx-auto max-w-[1280px] p-10 sm:p-28">
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

      <div className="flex">
        <div className="mb-10 mt-10 flex justify-between">
          <div className="flex w-full flex-wrap justify-between">
            <div className="flex w-[100%] sm:w-[34%]">
              <div
                className="w-[100%] text-[128px]"
                style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
              >
                <BlogTitle variant="Blog" />
              </div>
            </div>

            <div className="flex w-[100%] items-center sm:w-[65%]">
              <div className="flex h-min w-full items-center justify-center bg-black p-5 text-left font-poppins text-xl text-white drop-shadow-[16px_-16px_0px_#A90909]">
                <BlogTitle variant="title" />
              </div>
            </div>
          </div>
        </div>
        <div className="my-4 border-t border-dashed border-black"></div>
      </div>
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
    </main>
  )
}
