import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
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
import PostList from '@/components/client/blog/post-list'
import BlogTitle from '@/components/client/blog/blog-title'
import BlogFooter from '@/components/client/blog/blog-footer'
import { getPaginationRange } from '@/utils/getPaginationRange'
import { cn } from '@/utils/cn'

type Props = {
  params: Promise<{ locale: ILocale }>
  searchParams: Promise<{ page?: string }>
}
const url = process.env.NEXT_URL
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
  const t = await getTranslations('Breadcrumbs')
  const blogSearchParams = await searchParams

  const pageItem = parseInt(blogSearchParams.page || '1', 10)

  const postsData = await fetch(
    `${url}/api/posts?locale=${locale}&${new URLSearchParams(await searchParams).toString()}`,
    {
      next: {
        tags: ['posts'],
      },
    },
  ).then((res) => res.json())

  if (!postsData.success) return notFound()

  const { postsLocalized, currentPage, totalPages } =
    postsData as IGetPostsClient

  const getPageUrl = (
    newPage: number,
    searchParamsObj: Record<string, string>,
  ) => {
    const searchParams = new URLSearchParams(searchParamsObj)
    if (searchParams.get('page')) {
      searchParams.set('page', newPage.toString())
    } else {
      searchParams.append('page', newPage.toString())
    }
    return '?' + searchParams.toString()
  }

  return (
    <div className="mx-auto max-w-[1280px] overflow-hidden p-5">
      <div className="mt-10">
        <div className="mt-10">
          <Breadcrumb className="my-2">
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
                <BreadcrumbPage>{t('Page') + ' ' + pageItem}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <BlogTitle />
      <div className="mx-auto flex flex-col items-center font-bold">
        <PostList posts={postsLocalized} />

        {totalPages > 1 && (
          <Pagination className="mt-[60px] md:mt-[120px]">
            <PaginationContent>
              <PaginationItem
                className={cn(currentPage === 1 && 'cursor-auto')}
              >
                <PaginationPrevious
                  disabled={currentPage === 1}
                  href={
                    currentPage > 1
                      ? getPageUrl(currentPage - 1, blogSearchParams)
                      : '#'
                  }
                />
              </PaginationItem>
              {getPaginationRange(currentPage, totalPages).map(
                (item, index) => {
                  if (item === 'ellipsis') {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href={getPageUrl(item, blogSearchParams)}
                        isActive={postsData.currentPage === item}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                },
              )}

              <PaginationItem
                className={cn(currentPage === totalPages && 'cursor-auto')}
              >
                <PaginationNext
                  disabled={currentPage === totalPages}
                  href={
                    currentPage < totalPages
                      ? getPageUrl(currentPage + 1, blogSearchParams)
                      : '#'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <BlogFooter />
    </div>
  )
}
