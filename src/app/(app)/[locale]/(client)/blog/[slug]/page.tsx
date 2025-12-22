import { Metadata } from 'next'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import 'quill/dist/quill.snow.css'
import Share from '@/components/ui/share'
import NotFoundPage from '@/components/not-found'
import { locales } from '@/data/locales'
import { getPostsUrls } from '@/server/posts/get-posts-urls.server'
import BlogItemJsonLd from '@/components/client/json-ld/blog-item-json-ld'
import { fetchTags } from '@/data/fetch-tags'
import JoinCommunity from '@/components/client/promo-banner/join-community'
import ToTheTop from '@/components/ui/to-the-top'
import { revalidateDay } from '@/constants/revalidate'

export const revalidate = 86400

const baseUrl = process.env.NEXT_URL

type Props = {
  params: Promise<{ locale: ILocale; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params

  const data = await fetch(
    `${baseUrl}/api/posts/post?locale=${locale}&slug=${slug}&isVisited=false`,
    {
      next: { revalidate: revalidateDay, tags: [`${fetchTags.post}`] },
    },
  ).then((res) => res.json())

  if (!data.success || !data.post.length) {
    return {
      title: 'Post not found',
      description: 'The requested post could not be found.',
      robots: 'noindex, nofollow',
    }
  }

  const post = data.post[0]
  const metaKeywordsArray =
    post.keywords?.split(',').map((keyword: string) => keyword.trim()) || []

  const url = `${baseUrl}/${locale}/blog/${slug}`

  return {
    title: post.title,
    description: post.metaDescription,
    keywords: metaKeywordsArray,
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      url,
      images: post.img
        ? [
            {
              url: post.img,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
      type: 'article',
      publishedTime: post.createdAt,
      authors: post.author,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
      images: post.img,
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${url}`,
        uk: `${url}`,
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

  const data = await fetch(
    `${baseUrl}/api/posts/post?locale=${locale}&slug=${slug}&isVisited=true`,
    {
      next: { revalidate: revalidateDay, tags: [`${fetchTags.post}`] },
    },
  ).then((res) => res.json())

  if (!data.success) {
    return <NotFoundPage />
  }
  const url = `${baseUrl}/${locale}/blog/${slug}`

  const content = JSON.parse(data.post[0].content)
  const title = data.post[0].title
  const date = new Date(data.post[0].updatedAt).toLocaleDateString('uk-UA')
  const author = data.post[0].author
  const converter = new QuillDeltaToHtmlConverter(content.ops)
  const html = converter.convert().replace(/(<p>(?:<br\/>)+<\/p>)/g, '')

  return (
    <>
      <BlogItemJsonLd post={data.post[0]} />
      <div className="mx-auto flex max-w-[1280px] flex-col justify-center">
        <div className="my-20 px-20">
          <h1 className="bg-foreground text-background flex min-h-28 w-[100%] items-center justify-center px-10 py-5 text-left text-4xl leading-[48px] font-bold drop-shadow-[16px_-16px_0px_#A90909]">
            {title}
          </h1>
        </div>
        <div className="h-10"></div>
        <div className="mx-auto max-w-[1280px]">
          <article
            className="ql-editor prose lg:prose-xl"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
        <div className="my-20">
          <div className="border-foreground my-4 border-t border-dashed"></div>
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
