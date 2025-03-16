import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

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
import { getPaginationRange } from '@/utils/get-pagination-range'
import BlogJsonLd from '@/components/client/json-ld/blog-json-ld'
import { cn } from '@/utils/cn'

import { blogMetaData } from '@/data/blog/blogMetaData'
import { locales } from '@/data/locales'
import NotFoundPage from '@/components/not-found'
import { fetchTags } from '@/data/fetch-tags'

type PageProps = {
  params: Promise<{ locale: ILocale }>
  searchParams: Promise<{ page?: string }>
}

const baseUrl = process.env.NEXT_URL

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { page } = await searchParams

  const ogImage = `${baseUrl}/blog-image.webp`

  const url =
    page && +page > 1
      ? `${baseUrl}/${locale}/blog?page=${page}`
      : `${baseUrl}/${locale}/blog`

  return {
    title: blogMetaData[locale].title,
    description: blogMetaData[locale].description,
    keywords: blogMetaData[locale].keywords,
    robots: 'index, follow',
    openGraph: {
      title: blogMetaData[locale].openGraphTitle,
      description: blogMetaData[locale].openGraphDescription,
      url,
      type: 'website',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 1012,
          alt: blogMetaData[locale].alt,
        },
      ],
    },
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

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

export default async function Blog({ params, searchParams }: PageProps) {
  const { locale } = await params
  const t = await getTranslations('Breadcrumbs')
  const blogSearchParams = await searchParams

  const pageItem = parseInt(blogSearchParams.page || '1', 10)

  const postsData = await fetch(
    `${baseUrl}/api/posts?${new URLSearchParams({ ...(await searchParams), locale }).toString()}`,
    {
      cache: 'force-cache',
      next: { tags: [`${fetchTags.posts}`] },
    },
  ).then((res) => res.json())

  if (!postsData.success) return <NotFoundPage />

  const { postsLocalized, currentPage, totalPages } = postsData

  return (
    <>
      <BlogJsonLd data={postsData} />
      <div className="mx-auto max-w-[1280px] overflow-hidden p-5">
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
              <BreadcrumbPage>{t('Page') + ' ' + pageItem}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
    </>
  )
}
