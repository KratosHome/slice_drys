import { getPosts } from '@/server/posts/get-posts.server'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/client/ui/breadcrumbs'

export default async function PostPage({
  params,
}: {
  params: { slug: string; locale: string }
}) {
  const { slug, locale } = params

  const data = await getPosts({ locale, slug })
  if (!data.success) {
    return notFound()
  }
  const content = JSON.parse(data.post[0].content)
  const title = data.post[0].title
  const date = new Date(data.post[0].updatedAt).toLocaleDateString('uk-UA')
  const author = data.post[0].author
  const converter = new QuillDeltaToHtmlConverter(content.ops)
  const html = converter.convert()

  return (
    <main className="mx-auto flex max-w-[1280px] flex-col justify-center">
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
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="my-20 px-20">
        <div className="flex min-h-28 w-[100%] items-center justify-center bg-black px-10 py-5 text-left font-poppins text-4xl font-bold leading-[48px] text-white drop-shadow-[16px_-16px_0px_#A90909]">
          {title}
        </div>
      </div>
      <div className="h-10"></div>
      <div className="mx-auto flex max-w-[1280px] flex-col items-center">
        <h1 dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className="my-20">
        <div className="my-4 border-t border-dashed border-black"></div>
        <div className="flex justify-between">
          <div className="text-gray-500">{date}</div>
          <div className="text-gray-500">{author}</div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-5 sm:flex-row">
        <div
          className="text-[26px]"
          style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
        >
          Поділитись
        </div>
        <div className="flex gap-3">
          <Link href="#" className="w-fit">
            <Image
              src={'/icons/facebook.svg'}
              alt="facebook icon"
              width={32}
              height={32}
              className="cursor-pointer"
            />
            <div className="absolute bottom-0 left-0 right-0 top-0 group-data-[focus]:bg-red group-data-[focus]:blur-2xl"></div>
          </Link>
          <Link href="#" className="w-fit">
            <Image
              src={'/icons/instagram.svg'}
              alt="facebook icon"
              width={32}
              height={32}
              className="cursor-pointer"
            />
            <div className="absolute bottom-0 left-0 right-0 top-0 group-data-[focus]:bg-red group-data-[focus]:blur-2xl"></div>
          </Link>
          <Link href="#" className="w-fit">
            <Image
              src={'/icons/telegram.svg'}
              alt="facebook icon"
              width={32}
              height={32}
              className="cursor-pointer"
            />
            <div className="absolute bottom-0 left-0 right-0 top-0 group-data-[focus]:bg-red group-data-[focus]:blur-2xl"></div>
          </Link>
        </div>
      </div>
    </main>
  )
}
