'use client'

import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Splide, SplideSlide } from '@splidejs/react-splide'

import { Arrow } from '@/components/client/ui/arrow'
import { formatDate } from '@/utils/format-date'
import { AspectRatio } from '@/components/client/ui/aspect-ratio'
import { UnderlinedLink } from '@/components/client/ui/underlined-link'
import { useIsMobile } from '@/hooks/use-mobile'

import './blog.css'

interface BlogSectionProps {
  data: IPost[]
}

const BlogSection: FC<BlogSectionProps> = ({ data }) => {
  const t = useTranslations('main.more-about-us')
  const locale = useLocale()
  const isMobile = useIsMobile()

  return (
    <section
      aria-labelledby="more about us"
      className="section about-us bg-black text-white"
    >
      <div className="about__wrapper">
        <div className="mb-6 contents items-center justify-between md:flex md:gap-[40px]">
          <h2 className="title-section text-center !normal-case md:text-start">
            {t('title')}
          </h2>
          <UnderlinedLink
            href={`${locale}/blog`}
            className="md:order-0 order-1"
          >
            {t('more-btn')}
          </UnderlinedLink>
        </div>
        <div className="mt-[40px] w-full max-w-[400px] md:mt-[80px] md:max-w-none">
          <Splide
            options={{
              arrowPath: Arrow(),
              type: 'loop',
              perPage: isMobile ? 1 : 3,
              perMove: 1,
              pagination: true,
              arrows: true,
              autoplay: true,
              interval: 3000,
              focus: 'center',
              classes: {
                arrows: 'splide__arrows about__arrows',
                arrow: 'splide__arrow about__arrow',
                prev: 'splide__arrow--prev about__arrow-prev',
                next: 'splide__arrow--next about__arrow-next',
                pagination: 'splide__pagination about__pagination',
                page: 'splide__pagination__page about__pagination-page',
              },
            }}
          >
            {data.map((post) => (
              <SplideSlide key={post._id}>
                <div className="about__card">
                  <AspectRatio ratio={355 / 285} className="h-full">
                    <Image
                      src={post.img}
                      alt={post.title}
                      fill
                      className="rounded-xl object-cover"
                    />
                  </AspectRatio>
                  <div className="p-4">
                    <p className="mt-2 text-sm text-gray-400">
                      {formatDate(post.createdAt)}
                    </p>
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="card_link"
                    >
                      {post.title}
                    </Link>
                  </div>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
