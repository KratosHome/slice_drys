import { useId } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { UnderlinedLink } from '@/components/ui/underlined-link'
import { TransitionLink } from '@/components/client/transition-link'
import { formatDate } from '@/utils/format-date'
import BlogCarousel, { BlogImage } from './blog-carousel'

interface IBlogSectionProps {
  data: IPost[]
}

export default function BlogSection({ data }: IBlogSectionProps) {
  const titleId = useId()
  const t = useTranslations('main.more-about-us')
  const locale = useLocale() as ILocale

  return (
    <BlogCarousel
      titleId={titleId}
      header={
        <div className="mb-6 contents items-center justify-between md:flex md:gap-[40px]">
          <h2
            id={titleId}
            className="title-section text-center !normal-case md:text-start"
          >
            {t('title')}
          </h2>
          <UnderlinedLink
            href={`/${locale}/blog`}
            className="order-1 md:order-0"
          >
            {t('more-btn')}
          </UnderlinedLink>
        </div>
      }
    >
      {data.map((post, index) => (
        <li key={post._id} className="splide__slide">
          <div className="about__card">
            <TransitionLink href={`/${locale}/blog/${post.slug}`}>
              <AspectRatio ratio={355 / 285} className="h-full">
                <BlogImage
                  src={post.img}
                  alt={post.title}
                  fetchPriority={
                    index < 2 || index === data.length - 1 ? 'auto' : 'low'
                  }
                />
              </AspectRatio>
              <div className="p-4">
                <p className="mt-2 text-sm text-gray-400">
                  {formatDate(
                    post.createdAt instanceof Date
                      ? post.createdAt
                      : new Date(post.createdAt),
                  )}
                </p>
                <h3 className="card__link text-white">{post.title}</h3>
              </div>
            </TransitionLink>
          </div>
        </li>
      ))}
    </BlogCarousel>
  )
}
