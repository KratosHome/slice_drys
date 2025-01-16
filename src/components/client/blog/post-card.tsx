import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import {
  CardContainer,
  CardBody,
  CardItem,
} from '@/components/client/ui/3d-card'

interface PostCardProps {
  post?: IPost
}

export default function PostCard({ post }: PostCardProps) {
  const local = useLocale()

  if (!post) {
    return null
  }
  const rotateZ = Math.floor(Math.random() * 20) - 10

  return (
    <Link href={`/${local}/blog/${post?.slug}`}>
      <CardContainer className="w-full">
        <CardBody>
          <CardItem
            translateZ={-100}
            rotateZ={rotateZ}
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
          </CardItem>
          <CardItem translateZ={20}>
            <p className="text-left font-poppins text-lg font-normal text-gray-400">
              {new Date(post.updatedAt).toLocaleDateString('uk-UA')}
            </p>
          </CardItem>
          <CardItem rotateX={35} translateZ={100}>
            <p className="line-clamp-2 break-all text-left font-poppins text-2xl font-semibold">
              {post?.title}
            </p>
          </CardItem>
        </CardBody>
      </CardContainer>
    </Link>
  )
}
