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
  const data = await getPosts(locale, page, 8)

  return (
    <main>
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
    </main>
  )
}
