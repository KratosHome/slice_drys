'use client'
import { cn } from '@/utils/cn'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import SliderItem from './slider-item'
import Arcs from './arcs'
import { sliders, sliderLinks } from '@/data/hero-links'
import { useLocale } from 'next-intl'

export const Hero = () => {
  const { contextSafe } = useGSAP()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number>(0)

  const locale = useLocale()
  let sliderLinksLocale
  let slidersLocale

  if (locale === 'uk' || locale === 'en') {
    sliderLinksLocale = sliderLinks[locale]
    slidersLocale = sliders[locale]
  } else {
    sliderLinksLocale = sliderLinks['uk']
    slidersLocale = sliders['uk']
  }

  const hoverHexColor = slidersLocale[hoveredIndex].color

  const titleRef = useRef(null)
  const handleMouseEnter = contextSafe((index: number) => {
    if (index === currentIndex) return

    const tl = gsap.timeline()

    tl.to(titleRef.current, {
      duration: 0.3,
      opacity: 0,
      scaleX: 0.8,
      scaleY: 0.8,
      filter: 'blur(10px)',
      ease: 'power2.in',

      onComplete: () => {
        setCurrentIndex(index)

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
      },
    })

    setHoveredIndex(index)
  })

  const imgRef = useRef(null)
  useGSAP(
    () =>
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
      ),
    { scope: imgRef, dependencies: [hoveredIndex] },
  )

  return (
    <div className="container overflow-x-clip sm:pt-9 xl:overflow-x-visible">
      <div className="px-[20px]">
        <div
          className={cn(
            'relative w-fit origin-left -rotate-[2.92deg] transform text-[28px] font-bold leading-10 text-white',
            'sm:text-[40px] sm:leading-snug md:text-[48px] lg:text-[64px]',
          )}
          ref={titleRef}
        >
          <h1 className="mt-11 bg-black px-2.5 text-white lg:px-9">
            {slidersLocale[hoveredIndex].title}
          </h1>

          <div
            className="absolute top-0 -z-10 h-full w-full origin-left translate-x-1 translate-y-1 rotate-[0.58deg] lg:translate-x-2 lg:translate-y-2"
            style={{ background: hoverHexColor }}
          />
        </div>
      </div>

      <nav className="relative -mx-0.5 mt-16 flex justify-around lg:mt-20">
        {sliderLinksLocale.map((item, index) => (
          <div
            key={item.name}
            className={cn(
              'absolute bottom-0 h-[200%] translate-y-1/2',

              index === 0 && '-rotate-[50deg] lg:-rotate-[60deg]',
              index === 1 && '-rotate-[25deg] lg:-rotate-[30deg]',
              index === 2 && 'rotate-[0deg]',
              index === 3 && 'rotate-[25deg] lg:rotate-[30deg]',
              index === 4 && 'rotate-[50deg] lg:rotate-[60deg]',
            )}
          >
            <Link
              href={item.link}
              className={cn(
                'relative left-1/2 flex size-[80px] -translate-x-1/2 -translate-y-[61%]',
                'items-center justify-center rounded-full text-[20px] text-[#9B9B9B] transition-colors duration-300',
              )}
              onMouseEnter={() => handleMouseEnter(index)}
            >
              <SliderItem
                title={item.name}
                hoverHexColor={hoverHexColor}
                isHovered={hoveredIndex === index}
              />
            </Link>
          </div>
        ))}

        <div className="relative -z-10 mx-auto w-full max-w-[1104px]">
          <Arcs color={hoverHexColor} />

          <div className="absolute -bottom-2 right-1/2 h-4/5 w-2/3 translate-x-1/2 md:-bottom-16">
            <Image
              ref={imgRef}
              src={slidersLocale[hoveredIndex].image}
              alt="slider image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </nav>
    </div>
  )
}
