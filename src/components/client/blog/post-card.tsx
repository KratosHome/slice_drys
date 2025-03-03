import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'

import { AspectRatio } from '../ui/aspect-ratio'

import { cn } from '@/utils/cn'

interface PostCardProps {
  post?: IPost
  variant?: 'small' | 'big'
  className?: string
}

export default function PostCard({
  post,
  variant = 'small',
  className,
}: PostCardProps) {
  const local = useLocale()

  if (!post) {
    return null
  }

  return (
    <Link
      href={`/${local}/blog/${post?.slug}`}
      className={cn(
        'group w-full rounded-xl p-4 transition-all duration-300 ease-in-out will-change-transform active:scale-[0.95] active:shadow-xl lg:hover:shadow-xl',
        "relative max-w-[500px] md:max-w-none md:after:absolute md:after:top-0 md:after:h-full md:after:w-0 md:after:border-r md:after:border-dashed md:after:border-black md:after:content-[''] md:last:after:content-none",
        variant === 'big' ? 'md:after:-right-[25px]' : 'md:after:-right-[43px]',
        className,
      )}
    >
      <div>
        <AspectRatio
          ratio={variant === 'big' ? 593 / 475 : 355 / 285}
          className={cn(
            'h-full overflow-hidden transition-all duration-300 ease-in-out md:group-hover:rounded-xl',
            variant === 'big'
              ? 'md:group-hover:scale-105'
              : 'md:group-hover:scale-[109%]',
          )}
        >
          <Image
            src={post?.img || ''}
            alt={post?.title}
            fill
            className="object-cover"
            sizes={
              variant === 'big'
                ? '(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 50vw'
                : '(max-width: 768px) 50vw, 30vw'
            }
          />
        </AspectRatio>
        <p
          className={cn(
            'mt-3 font-poppins text-lg font-normal text-gray-400 transition-all duration-300 ease-in-out md:mt-5 md:group-hover:scale-[98%]',
            variant === 'big' && 'px-4',
          )}
        >
          {new Date(post.updatedAt).toLocaleDateString('uk-UA')}
        </p>
        <p
          className={cn(
            'mt-1 line-clamp-2 text-ellipsis text-wrap font-poppins font-semibold transition-all duration-300 ease-in-out md:group-hover:scale-[98%]',
            variant === 'big'
              ? 'text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)]'
              : 'text-[clamp(14px,calc(14px+6*(100vw-768px)/672),20px)]',
          )}
        >
          {post?.title}
        </p>
      </div>
    </Link>
  )
}
