import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumbs'
import PostList from '@/components/client/blog/post-list'
import BlogTitle from '@/components/client/blog/blog-title'
import BlogFooter from '@/components/client/blog/blog-footer'
import { getPaginationRange } from '@/utils/get-pagination-range'
import BlogJsonLd from '@/components/client/json-ld/blog-json-ld'
import { cn } from '@/utils/cn'

import { blogMetaData } from '@/data/blog/blog-meta-data'
import { locales } from '@/data/locales'
import ToTheTop from '@/components/ui/to-the-top'
import { SITE_URL } from '@/data/contacts'
import { getPublicPosts } from '@/server/public-data-cache.server'

export const revalidate = 86400

type PageProps = {
  params: Promise<{ locale: ILocale }>
  searchParams: Promise<{ page?: string }>
}

const parsePageNumber = (value?: string) => {
  if (value === undefined) return 1
  if (!/^\d+$/.test(value)) return null

  const page = Number(value)
  return Number.isSafeInteger(page) && page >= 1 ? page : null
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { locale } = await params
  const { page: pageParam } = await searchParams
  const page = parsePageNumber(pageParam)

  const ogImage = `${SITE_URL}/blog-image.webp`

  const pageSuffix = page && page > 1 ? `?page=${page}` : ''
  const canonicalUrl = `${SITE_URL}/${locale}/blog${pageSuffix}`
  const pageTitle =
    page && page > 1
      ? `${blogMetaData[locale].title} — ${locale === 'uk' ? 'Сторінка' : 'Page'} ${page}`
      : blogMetaData[locale].title

  return {
    title: pageTitle,
    description: blogMetaData[locale].description,
    keywords: blogMetaData[locale].keywords,
    robots: 'index, follow',
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: `${SITE_URL}/en/blog${pageSuffix}`,
        uk: `${SITE_URL}/uk/blog${pageSuffix}`,
        'x-default': `${SITE_URL}/uk/blog${pageSuffix}`,
      },
    },
    openGraph: {
      title: pageTitle,
      description: blogMetaData[locale].openGraphDescription,
      url: canonicalUrl,
      type: 'website',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      images: [
        {
          url: ogImage,
          width: 828,
          height: 648,
          alt: blogMetaData[locale].alt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: blogMetaData[locale].description,
      images: [ogImage],
    },
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

const getPageUrl = (
  newPage: number,
  searchParamsObj: Record<string, string>,
  basePath: string,
) => {
  const searchParams = new URLSearchParams(searchParamsObj)
  if (newPage === 1) searchParams.delete('page')
  else searchParams.set('page', newPage.toString())

  const query = searchParams.toString()
  return query ? `${basePath}?${query}` : basePath
}

export default async function Blog({ params, searchParams }: PageProps) {
  const { locale } = await params
  const [t, tPagin] = await Promise.all([
    getTranslations('breadcrumbs'),
    getTranslations('pagination'),
  ])
  const blogSearchParams = await searchParams

  const pageItem = parsePageNumber(blogSearchParams.page)

  if (pageItem === null) notFound()
  if (blogSearchParams.page !== undefined && pageItem === 1) {
    permanentRedirect(`/${locale}/blog`)
  }

  const postsData = await getPublicPosts(locale, pageItem, 8)

  if (!postsData.success || !('postsLocalized' in postsData)) notFound()

  const validatedPostsData = postsData as IGetPostsClient
  const { postsLocalized, currentPage, totalPages } = validatedPostsData

  if (pageItem > 1 && (totalPages === 0 || pageItem > totalPages)) notFound()

  return (
    <>
      <BlogJsonLd data={validatedPostsData} />
      <div className="mx-auto max-w-[1280px] overflow-hidden p-5">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}`}>{t('home')}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${locale}/blog`}>
                {t('blog')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{t('page') + ' ' + pageItem}</BreadcrumbPage>
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
                    className="text-[36px] md:text-[64px]"
                    disabled={currentPage === 1}
                    label={tPagin('previous')}
                    href={
                      currentPage > 1
                        ? getPageUrl(
                            currentPage - 1,
                            blogSearchParams,
                            `/${locale}/blog`,
                          )
                        : '#'
                    }
                  />
                </PaginationItem>
                {getPaginationRange(currentPage, totalPages).map(
                  (item, index) => {
                    if (item === 'ellipsis') {
                      return (
                        <PaginationItem key={`ellipsis-${index}`}>
                          <PaginationEllipsis className="text-xl sm:text-2xl md:text-4xl" />
                        </PaginationItem>
                      )
                    }
                    return (
                      <PaginationItem key={item}>
                        <PaginationLink
                          href={getPageUrl(
                            item,
                            blogSearchParams,
                            `/${locale}/blog`,
                          )}
                          isActive={validatedPostsData.currentPage === item}
                          label={
                            validatedPostsData.currentPage === item
                              ? tPagin('active-page', { page: item })
                              : tPagin('go-to-page', { page: item })
                          }
                          className="text-xl sm:text-2xl md:text-4xl"
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
                    className="text-[36px] md:text-[64px]"
                    disabled={currentPage === totalPages}
                    label={tPagin('next')}
                    href={
                      currentPage < totalPages
                        ? getPageUrl(
                            currentPage + 1,
                            blogSearchParams,
                            `/${locale}/blog`,
                          )
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
      <ToTheTop />
    </>
  )
}
