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

type Props = {
  params: Promise<{ locale: ILocale }>
  searchParams: Promise<{ page?: string }>
}

const translations = {
  en: {
    title: 'Blog',
    description: 'This is the blog page.',
    keywords: ['blog', 'articles', 'news'],
  },
  uk: {
    title: 'Блог',
    description: 'Це сторінка блогу.',
    keywords: ['блог', 'статті', 'новини'],
  },
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params

  return translations[locale]
}

export default async function Blog({ params, searchParams }: Props) {
  const { locale } = await params
  const { page } = await searchParams

  const pageItem = parseInt(page || '1', 10)
  const limit = 8
  const data = await getPosts({ locale, page: pageItem, limit })
  const countOfPages = Math.ceil((data.totalPosts || 0) / limit)

  return (
    <div className="mx-auto max-w-[1280px] p-5">
      <div className="mt-10"></div>

      <BlogTitle />
      <div className="mx-auto flex flex-col items-center">
        <PostList posts={data.post} />
        <Pagination>
          <PaginationContent className="m-10">
            <PaginationItem>
              <PaginationPrevious
                size={'default'}
                className={`${pageItem === 1 ? 'pointer-events-none opacity-50' : ''}`}
                href={`?page=${pageItem > 1 ? pageItem - 1 : 1}`}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                size={'default'}
                className="mx-5"
                href={`?page=${pageItem}`}
              >
                {pageItem}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                size={'default'}
                className={`${pageItem === countOfPages ? 'pointer-events-none opacity-50' : ''}`}
                href={`?page=${pageItem + 1}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
