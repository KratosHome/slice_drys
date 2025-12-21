import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import 'quill/dist/quill.snow.css'

export const revalidate = 86400

import Share from '@/components/ui/share'
import { locales } from '@/data/locales'
import { getPostsUrls } from '@/server/posts/get-posts-urls.server'
import BlogItemJsonLd from '@/components/client/json-ld/blog-item-json-ld'
import JoinCommunity from '@/components/client/promo-banner/join-community'
import ToTheTop from '@/components/ui/to-the-top'
import { revalidateDay } from '@/constants/revalidate'

const SITE_URL = process.env.NEXT_URL

function requireSiteUrl() {
  if (!SITE_URL) throw new Error('NEXT_URL is not set')
  return SITE_URL
}

type Props = {
  params: Promise<{ locale: ILocale; slug: string }>
}

type PostResponse =
  | { success: true; post: Array<any> }
  | { success: false; post?: Array<any>; message?: string }

async function fetchPost(slug: string, locale: ILocale) {
  const baseUrl = requireSiteUrl()
  const url = new URL('/api/posts/post', baseUrl)
  url.searchParams.set('locale', locale)
  url.searchParams.set('slug', slug)
  url.searchParams.set('isVisited', 'false')

  const doFetch = (init?: RequestInit) =>
    fetch(url.toString(), {
      ...init,
      next: {
        revalidate: revalidateDay,
        tags: [`post:${locale}:${slug}`],
      },
    })

  const parse = async (res: Response) => {
    if (res.status === 404) return null
    if (!res.ok)
      throw new Error(`fetchPost failed: ${res.status} ${res.statusText}`)

    const data = (await res.json()) as PostResponse
    if (!data || data.success !== true)
      throw new Error('fetchPost returned success:false')

    return data.post?.[0] ?? null
  }

  const res1 = await doFetch()

  if (res1.status === 404 || res1.status >= 500) {
    const res2 = await doFetch({ cache: 'no-store' })
    return parse(res2)
  }

  return parse(res1)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params

  const post = await fetchPost(slug, locale).catch(() => null)
  if (!post) {
    return {
      title: 'Post not found',
      description: 'The requested post could not be found.',
      robots: 'noindex, nofollow',
    }
  }

  const url = `${requireSiteUrl()}/${locale}/blog/${slug}`
  const keywords =
    post.keywords
      ?.split(',')
      .map((k: string) => k.trim())
      .filter(Boolean) ?? []

  return {
    title: post.title,
    description: post.metaDescription,
    keywords,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url,
      images: post.img
        ? [{ url: post.img, width: 1200, height: 630, alt: post.title }]
        : [],
      type: 'article',
      publishedTime: post.createdAt,
      authors: post.author,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
      images: post.img ? [post.img] : [],
    },
    alternates: {
      canonical: url,
      languages: {
        en: url,
        uk: url,
      },
    },
  }
}

export async function generateStaticParams() {
  const postSlug = await getPostsUrls()
  return postSlug.data.flatMap((item: { slug: string }) =>
    locales.map((locale) => ({
      slug: item.slug,
      locale,
    })),
  )
}

export default async function PostPage({ params }: Props) {
  const { slug, locale } = await params

  const post = await fetchPost(slug, locale)

  if (!post) notFound()

  const url = `${requireSiteUrl()}/${locale}/blog/${slug}`

  const content = JSON.parse(post.content)
  const converter = new QuillDeltaToHtmlConverter(content.ops)
  const html = converter.convert().replace(/(<p>(?:<br\/>)+<\/p>)/g, '')

  const title = post.title
  const date = new Date(post.updatedAt).toLocaleDateString('uk-UA')
  const author = post.author

  return (
    <>
      <BlogItemJsonLd post={post} />
      <div className="mx-auto flex max-w-[1280px] flex-col justify-center">
        <div className="my-20 px-20">
          <h1 className="bg-foreground text-background flex min-h-28 w-[100%] items-center justify-center px-10 py-5 text-left text-4xl leading-[48px] font-bold drop-shadow-[16px_-16px_0px_#A90909]">
            {title}
          </h1>
        </div>

        <div className="h-10" />

        <div className="mx-auto max-w-[1280px]">
          <article
            className="ql-editor prose lg:prose-xl"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>

        <div className="my-20">
          <div className="border-foreground my-4 border-t border-dashed" />
          <div className="flex justify-between">
            <div className="text-gray-500">{date}</div>
            <div className="text-gray-500">{author}</div>
          </div>
        </div>

        <Share title={title} url={url} />
        <JoinCommunity className="my-[70px] mb-[100px] md:mt-[120px]" />
      </div>

      <ToTheTop />
    </>
  )
}
