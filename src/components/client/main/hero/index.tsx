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
  device: IDevice
  productLinks: ICategory[]
}

export default function Hero({ device, productLinks }: IHeroProps) {
  const { isDesktop } = device
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)

  const locale = useLocale() as ILocale
  const slidersLocale = sliders[locale]

  const hoverHexColor = slidersLocale[hoveredIndex].color

  const titleRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const subImagesRefs = useRef<HTMLImageElement[]>([])

  const handleMainImageAnimation = (status: boolean): void => {
    const tl = gsap.timeline()

    if (status) {
      tl.to(imgRef.current, {
        rotate: 35,
        duration: 1,
      })
    }
  }

  useGSAP(
    () => {
      gsap.fromTo(
        imgRef.current,
        {
          opacity: 0,
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

      if (slidersLocale[hoveredIndex].subImages) {
        const mm = gsap.matchMedia()

        subImagesRefs.current.forEach((el, index) => {
          mm.add('(min-width: 1024px)', () => {
            gsap.to(el, {
              opacity: 1,
              duration: 1.5,
              x: slidersLocale[hoveredIndex].subImages?.[index]?.position
                .desktop.x,
              y: slidersLocale[hoveredIndex]?.subImages?.[index]?.position
                .desktop.y,
              ease: 'power2.out',
            })
          })
        })
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
            <h1 className="text-background bg-foreground mt-11 px-2.5 lg:px-9">
              {slidersLocale[hoveredIndex].title}
            </h1>
            <div
              className="absolute top-0 -z-10 h-full w-full origin-left translate-x-1 translate-y-1 rotate-[0.58deg] lg:translate-x-2 lg:translate-y-2"
              style={{ background: hoverHexColor }}
            />
          </div>
        </div>
        <nav className="relative -mx-0.5 mt-16 flex justify-around lg:mt-20">
          {productLinks.map((item, index) => (
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
                href={`${locale}/${item.slug}`}
                className={cn(
                  'relative left-1/2 flex size-[80px] -translate-x-1/2 -translate-y-[61%] uppercase',
                  'items-center justify-center rounded-full text-[20px] text-[#9B9B9B] transition-colors duration-300',
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                aria-label={item.name[locale]}
              >
                <SliderItem
                  title={item.name[locale]}
                  hoverHexColor={hoverHexColor}
                  isHovered={hoveredIndex === index}
                />
              </TransitionLink>
            </div>
          ))}

          <div className="relative -z-10 mx-auto w-full max-w-[1104px]">
            <Arcs color={hoverHexColor} />
            <div className="absolute right-1/2 -bottom-2 z-20 h-4/5 w-2/3 translate-x-1/2 md:-bottom-16">
              <Image
                ref={imgRef}
                src={slidersLocale[hoveredIndex].image}
                alt="Slider image"
                fill
                priority
                loading="eager"
                quality={60}
                sizes="(max-width: 550px) 100vw, 50vw"
                role="img"
                className="object-contain"
                onMouseEnter={() => handleMainImageAnimation(true)}
                onMouseLeave={() => handleMainImageAnimation(false)}
              />
            </div>

            {slidersLocale[hoveredIndex].subImages && isDesktop ? (
              <SubImages
                subImages={slidersLocale[hoveredIndex].subImages}
                subImagesRefs={subImagesRefs}
                device={device}
              />
            ) : null}
          </div>
        </nav>
      </div>
    </div>
  )
}
