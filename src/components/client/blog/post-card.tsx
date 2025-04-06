'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { AspectRatio } from '@/components/ui/aspect-ratio'

import { cn } from '@/utils/cn'
import { ResponsiveMotion } from '@/components/client/responsiv-motion/responsive-motion'

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
    <ResponsiveMotion
      whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)' }}
      transition={{ duration: 0.3 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'group w-full rounded-xl p-4 will-change-transform active:scale-[0.95] active:shadow-xl',
        "relative max-w-[500px] md:max-w-none md:after:absolute md:after:top-0 md:after:h-full md:after:w-0 md:after:border-r md:after:border-dashed md:after:border-black md:after:content-[''] md:last:after:content-none",
        variant === 'big' ? 'md:after:-right-[25px]' : 'md:after:-right-[43px]',
        className,
      )}
    >
      <Link href={`/${local}/blog/${post?.slug}`}>
        <div>
          <AspectRatio
            ratio={variant === 'big' ? 593 / 475 : 355 / 285}
            className="h-full overflow-hidden"
          >
            <Image
              src={post?.img || ''}
              alt={post?.title}
              fill
              className="h-full w-full object-cover transition-all duration-300 group-hover:rounded-2xl"
              sizes={
                variant === 'big'
                  ? '(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 50vw'
                  : '(max-width: 768px) 50vw, 30vw'
              }
            />
          </AspectRatio>
          <p
            className={cn(
              'font-poppins mt-3 text-lg font-normal text-gray-400 md:mt-5',
              variant === 'big' && 'px-4',
            )}
          >
            {new Date(post.updatedAt).toLocaleDateString('uk-UA')}
          </p>
          <p
            className={cn(
              'font-poppins mt-1 line-clamp-2 font-semibold text-wrap text-ellipsis',
              variant === 'big'
                ? 'text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)]'
                : 'text-[clamp(14px,calc(14px+6*(100vw-768px)/672),20px)]',
            )}
          >
            {post?.title}
          </p>
        </div>
      </Link>
    </ResponsiveMotion>
  )
}
