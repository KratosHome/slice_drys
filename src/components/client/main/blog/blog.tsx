'use client'

import { FC, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { Splide, SplideSlide } from '@splidejs/react-splide'

import { Arrow } from '@/components/ui/arrow'
import { formatDate } from '@/utils/format-date'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { UnderlinedLink } from '@/components/ui/underlined-link'
import { useIsMobile } from '@/hooks/use-mobile'
import '@splidejs/react-splide/css'
import './blog.css'

interface BlogSectionProps {
  data: IPost[]
}

const BlogSection: FC<BlogSectionProps> = ({ data }) => {
  const t = useTranslations('main.more-about-us')
  const locale = useLocale()
  const isMobile = useIsMobile()

  useEffect(() => {
    const target = document.querySelector('.blog-slider')
    if (!target) return
    const handleResize = () => {
      let k: number
      switch (true) {
        case window.innerWidth >= 1280:
          k = 35
          break
        case window.innerWidth >= 1024:
          k = 30
          break
        case window.innerWidth >= 768:
          k = 28
          break
        case window.innerWidth < 768:
          k = 23
          break
        default:
          k = 30
      }
      const x = data.length * k
      const prev = document.querySelector(
        '.blog-slider .splide__arrow--prev.custom__arrow-prev',
      ) as HTMLElement
      const next = document.querySelector(
        '.blog-slider .splide__arrow--next.custom__arrow-next',
      ) as HTMLElement

      if (prev && next) {
        prev.style.setProperty('--tw-arrow-translate', `-${x}px`)
        next.style.setProperty('--tw-arrow-translate', `${x}px`)
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)

    if (target) {
      resizeObserver.observe(target)
    }

    return () => {
      if (target) {
        resizeObserver.unobserve(target)
      }
    }
  }, [data])

  return (
    <section
      aria-labelledby="more about us"
      className="section about-us bg-black text-white"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-[20px] py-[32px] md:block md:px-[clamp(20px,calc(20px+80*(100vw-768px)/672),100px)] lg:py-[52px]">
        <div className="mb-6 contents items-center justify-between md:flex md:gap-[40px]">
          <h2 className="title-section text-center normal-case! md:text-start">
            {t('title')}
          </h2>
          <UnderlinedLink
            href={`${locale}/blog`}
            className="order-1 md:order-0"
          >
            {t('more-btn')}
          </UnderlinedLink>
        </div>
        <div className="mt-[40px] w-full max-w-[400px] md:mt-[80px] md:max-w-none">
          <Splide
            aria-labelledby="blog section"
            className="blog-slider"
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
                arrows: 'splide__arrows custom__arrows',
                arrow: 'splide__arrow custom__arrow',
                prev: 'splide__arrow--prev custom__arrow-prev',
                next: 'splide__arrow--next custom__arrow-next',
                pagination:
                  'bottom-[-80px] gap-[3px] md:bottom-[-77px] xl:bottom-[-79px]',
                page: 'splide__pagination__page custom__pagination-page',
              },
            }}
          >
            {data.map((post) => (
              <SplideSlide key={post._id}>
                <div className="relative h-full rounded-xl bg-gray-900 transition-all duration-300 ease-in-out will-change-transform active:-translate-y-1 active:shadow-[0px_4px_10px_3px_rgba(255,255,255,0.15)] lg:hover:-translate-y-1 lg:hover:shadow-[0px_4px_10px_3px_rgba(255,255,255,0.15)]">
                  <AspectRatio ratio={355 / 285} className="h-full">
                    <Image
                      src={post.img}
                      alt={post.title}
                      fill
                      className="rounded-[12px_12px_0_0] object-cover"
                    />
                  </AspectRatio>
                  <div className="p-4">
                    <p className="mt-2 text-sm text-gray-400">
                      {formatDate(post.createdAt)}
                    </p>
                    <Link
                      href={`/${locale}/blog/${post.slug}`}
                      className="text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] font-medium text-balance before:absolute before:inset-0 before:cursor-pointer"
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
