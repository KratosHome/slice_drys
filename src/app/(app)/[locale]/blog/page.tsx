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

type Props = {
  params: { locale: string }
  searchParams: { page?: string }
}

export default async function Home({ params, searchParams }: Props) {
  const { locale } = params
  const page = parseInt(searchParams.page || '1', 10)
  const postsOnPage = 8
  const data = await getPosts(locale, page, postsOnPage)
  const pageCount = Math.ceil(data.totalPosts / postsOnPage)

  return (
    <main className="mx-auto flex max-w-[1280px] flex-col items-center">
      <PostList posts={data.post} />
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={`?page=${page > 1 ? page - 1 : 1}`} />
          </PaginationItem>

          {/* Додавання всіх сторінок в пагінаційні елементи */}
          {Array.from({ length: pageCount }, (_, idx) => (
            <PaginationItem key={idx} className="w-4">
              <PaginationLink href={`?page=${idx + 1}`}>
                {idx + 1 == page ? (
                  <img
                    src={'/icons/pagination-dot-active.svg'}
                    alt="Next"
                    width="16"
                    height="16"
                  />
                ) : (
                  <img
                    src={'/icons/pagination-dot.svg'}
                    alt="Next"
                    width="16"
                    height="16"
                  />
                )}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={`?page=${page < pageCount ? page + 1 : pageCount}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  )
}
