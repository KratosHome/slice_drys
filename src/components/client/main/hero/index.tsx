'use client'

import { sliders } from '@/data/hero-links'

import Image from 'next/image'
import SliderItem from './slider-item'
import Arcs from './arcs'
import SubImages from './sub-images'
import { TransitionLink } from '@/components/client/transition-link'

import { useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { cn } from '@/utils/cn'

gsap.registerPlugin(useGSAP)

interface IHeroProps {
  productLinks: IPublicCategoryLink[]
}

export default function Hero({ productLinks }: IHeroProps) {
  const locale = useLocale() as ILocale
  const slidersLocale = sliders[locale]
  const heroLinks = productLinks
    .filter((link) =>
      slidersLocale.some((slider) => slider.slug === link.slug.toLowerCase()),
    )
    .slice(0, slidersLocale.length)
  const [activeSlug, setActiveSlug] = useState(
    heroLinks[0]?.slug.toLowerCase() ?? slidersLocale[0].slug,
  )
  const hoveredIndex = Math.max(
    0,
    slidersLocale.findIndex((slider) => slider.slug === activeSlug),
  )

  const hoverHexColor = slidersLocale[hoveredIndex].color

  const titleRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const subImagesRefs = useRef<HTMLImageElement[]>([])

  const isMounted = useRef(false)

  useGSAP(
    () => {
      const currentSubImages = slidersLocale[hoveredIndex].subImages ?? []
      const currentSubImageElements = subImagesRefs.current
        .slice(0, currentSubImages.length)
        .filter((element) => element?.isConnected)

      const placeSubImages = (): void => {
        currentSubImageElements.forEach((element, index) => {
          const position = currentSubImages[index]?.position.desktop

          if (!position) return

          gsap.set(element, {
            opacity: 1,
            x: position.x,
            y: position.y,
          })
        })
      }

      if (!isMounted.current) {
        isMounted.current = true
        placeSubImages()
        return
      }

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set(imgRef.current, {
          opacity: 1,
          scaleX: 1,
          scaleY: 1,
          filter: 'blur(0px)',
        })
        gsap.set(titleRef.current, {
          opacity: 1,
          scaleX: 1,
          scaleY: 1,
          filter: 'blur(0px)',
        })
        placeSubImages()
        return
      }

      gsap.fromTo(
        imgRef.current,
        {
          scaleX: 0.2,
          scaleY: 0.2,
          filter: 'blur(30px)',
        },
        {
          opacity: 1,
          scaleX: 1,
          scaleY: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'expo',
        },
      )

      gsap.fromTo(
        titleRef.current,
        { opacity: 0, scaleX: 1.2, scaleY: 1.2, filter: 'blur(10px)' },
        {
          opacity: 1,
          scaleX: 1,
          scaleY: 1,
          filter: 'blur(0px)',
          duration: 0.2,
          ease: 'power2.out',
        },
      )

      if (currentSubImages.length > 0) {
        const mm = gsap.matchMedia()

        currentSubImageElements.forEach((el, index) => {
          mm.add('(min-width: 1024px)', () => {
            gsap.fromTo(
              el,
              { opacity: 0, x: 0, y: 0 },
              {
                opacity: 1,
                duration: 1.5,
                x: currentSubImages[index]?.position.desktop.x,
                y: currentSubImages[index]?.position.desktop.y,
                ease: 'power2.out',
              },
            )
          })
        })

        return () => mm.revert()
      }
    },
    { scope: imgRef, dependencies: [hoveredIndex] },
  )

  return (
    <div className="overflow-hidden" aria-labelledby="hero">
      <div className="container mx-auto mb-[255px] max-w-[1280px] overflow-x-clip px-5 sm:pt-9 xl:overflow-x-visible">
        <div className="px-[20px]">
          <div
            className={cn(
              'relative w-fit origin-left -rotate-[2.92deg] transform text-[28px] leading-10 font-bold text-white',
              'sm:text-[40px] sm:leading-snug md:text-[48px] lg:text-[64px]',
            )}
            ref={titleRef}
          >
            <h1
              id="hero"
              className="text-background bg-foreground mt-11 px-2.5 lg:px-9"
            >
              {slidersLocale[hoveredIndex].title}
            </h1>
            <div
              className="absolute top-0 -z-10 h-full w-full origin-left translate-x-1 translate-y-1 rotate-[0.58deg] lg:translate-x-2 lg:translate-y-2"
              style={{ background: hoverHexColor }}
            />
          </div>
        </div>
        <nav className="relative -mx-0.5 mt-16 flex justify-around lg:mt-20">
          {heroLinks.map((item, index) => (
            <div
              key={item.slug}
              className={cn(
                'absolute bottom-0 z-1 h-[200%] translate-y-1/2',
                index === 0 && '-rotate-[50deg] lg:-rotate-[60deg]',
                index === 1 && '-rotate-[25deg] lg:-rotate-[30deg]',
                index === 2 && 'rotate-[0deg]',
                index === 3 && 'rotate-[25deg] lg:rotate-[30deg]',
                index === 4 && 'rotate-[50deg] lg:rotate-[60deg]',
              )}
            >
              <TransitionLink
                href={`/${locale}/products/${item.slug}`}
                className={cn(
                  'relative left-1/2 flex size-[80px] -translate-x-1/2 -translate-y-[61%] uppercase',
                  'items-center justify-center rounded-full text-[20px] text-[#9B9B9B] transition-colors duration-300',
                )}
                onFocus={() => setActiveSlug(item.slug.toLowerCase())}
                onMouseEnter={() => setActiveSlug(item.slug.toLowerCase())}
                aria-label={item.name[locale]}
              >
                <SliderItem
                  title={item.name[locale]}
                  hoverHexColor={hoverHexColor}
                  isHovered={activeSlug === item.slug.toLowerCase()}
                />
              </TransitionLink>
            </div>
          ))}

          <div className="relative z-0 mx-auto w-full max-w-[1104px]">
            <Arcs color={hoverHexColor} />
            <div className="absolute right-1/2 -bottom-2 z-20 h-4/5 w-2/3 translate-x-1/2 md:-bottom-16">
              <Image
                ref={imgRef}
                src={slidersLocale[hoveredIndex].image}
                alt={slidersLocale[hoveredIndex].title}
                fill
                priority={hoveredIndex === 0}
                loading="eager"
                quality={60}
                sizes="(max-width: 1280px) 64vw, 736px"
                className="object-contain"
              />
            </div>

            {slidersLocale[hoveredIndex].subImages ? (
              <SubImages
                subImages={slidersLocale[hoveredIndex].subImages}
                subImagesRefs={subImagesRefs}
              />
            ) : null}
          </div>
        </nav>
      </div>
    </div>
  )
}
