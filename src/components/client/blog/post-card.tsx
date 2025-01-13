import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Post } from '@/server/posts/postSchema'
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card' // Імпортуємо необхідні компоненти

interface PostCardProps {
  post?: IPost
  key?: any
  image?: string
  title?: string
  date?: string
  slag?: string
}

export default function PostCard({
  post,
  key,
  image,
  title,
  date,
  slag,
}: PostCardProps) {
  const local = useLocale()

  if (!post) {
    return null
  }

  return (
    <CardContainer className="w-full">
      {' '}
      {/* Використовуємо CardContainer */}
      <CardBody>
        <CardItem
          as={Link}
          href={`/${local}/blog/${post?.slug}`}
          className="flex-1 cursor-pointer"
        >
          <div className="relative w-full pb-[75%]">
            <Image
              src={post?.img || ''}
              alt={post?.title}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div>
            <p className="text-left font-poppins text-lg font-normal text-gray-400">
              {new Date(post.updatedAt).toLocaleDateString('uk-UA')}
            </p>
            <p className="line-clamp-2 break-all text-left font-poppins text-2xl font-semibold">
              {post?.title}
            </p>
          </div>
        </CardItem>
      </CardBody>
    </CardContainer>
  )
}
