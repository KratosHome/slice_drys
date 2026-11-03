'use client'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { AspectRatio } from '@/components/ui/aspect-ratio'

import { cn } from '@/utils/cn'
import { ResponsiveMotion } from '@/components/client/responsive-motion'
import { TransitionLink } from '@/components/client/transition-link'

interface PostCardProps {
  post?: IPost
  variant?: 'small' | 'big'
  className?: string
  priority?: boolean
}

export default function PostCard({
  post,
  variant = 'small',
  className,
  priority = false,
}: PostCardProps) {
  const local = useLocale()

  if (!post) {
    return null
  }

  return (
    <TransitionLink
      href={`/${local}/blog/${post?.slug}`}
      className={cn(
        "md:after:border-foreground relative max-w-[500px] min-w-0 md:max-w-none md:after:absolute md:after:top-0 md:after:h-full md:after:w-0 md:after:border-r md:after:border-dashed md:after:content-[''] md:last:after:content-none",
        variant === 'big' ? 'md:after:-right-[25px]' : 'md:after:-right-[43px]',
        className,
      )}
    >
      <ResponsiveMotion variant="card" className="group w-full rounded-xl p-4">
        <div>
          <AspectRatio
            ratio={variant === 'big' ? 593 / 475 : 355 / 285}
            className="h-full overflow-hidden"
          >
            <Image
              src={post?.img || ''}
              alt={post?.title}
              fill
              loading={priority ? 'eager' : 'lazy'}
              fetchPriority={priority ? 'high' : undefined}
              className="h-full w-full object-cover transition-all duration-300 group-hover:rounded-2xl"
              sizes={
                variant === 'big'
                  ? '(max-width: 539px) calc(100vw - 72px), (max-width: 767px) 468px, (max-width: 1279px) calc(50vw - 77px), 563px'
                  : '(max-width: 767px) calc(50vw - 52px), (max-width: 1279px) calc((100vw - 308px) / 3), 324px'
              }
            />
          </AspectRatio>
          <p
            className={cn(
              'mt-3 text-lg font-normal text-gray-400 md:mt-5',
              variant === 'big' && 'px-4',
            )}
          >
            {new Date(post.updatedAt).toLocaleDateString('uk-UA')}
          </p>
          <p
            className={cn(
              'mt-1 font-semibold wrap-anywhere md:line-clamp-2',
              variant === 'big'
                ? 'text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)]'
                : 'text-[clamp(14px,calc(14px+6*(100vw-768px)/672),20px)]',
            )}
          >
            {post?.title}
          </p>
        </div>
      </ResponsiveMotion>
    </TransitionLink>
  )
}
