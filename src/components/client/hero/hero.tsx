'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { gsap } from 'gsap'
import { cn } from '@/utils/cn'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'

export const Hero = () => {
  const { contextSafe } = useGSAP()

  const sliderLinks = [
    { name: 'М’ЯСО', link: '/products/meat.tsx#product' },
    { name: 'ФРУКТИ', link: '/products/fruits' },
    { name: 'ОВОЧІ', link: '/products/vegetables' },
    { name: 'МІКСИ', link: '/products/mix' },
  ]

  const sliders = [
    { title: "М'ясні сушені, що вражають" },
    { title: 'Фруктові сушені, що вражають' },
    { title: 'Овочеві сушені, що вражають' },
    { title: 'Мікс сушені, що вражають' },
  ]

  const titleRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0)

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

  return (
    <div className="mx-auto max-w-[1280px] px-[20px]">
      <h1 ref={titleRef} className="mt-11 text-[64px] font-bold">
        {sliders[currentIndex].title}
      </h1>
      <nav className="mt-[50px] flex justify-around">
        {sliderLinks.map((item, index) => (
          <div key={item.name} className="relative">
            <Link
              href={item.link}
              className={cn(
                'relative z-10 flex size-[180px] items-center justify-center rounded-full text-[20px] text-[#9B9B9B] transition-colors duration-300',
                index === 0 && 'absolute -ml-[12px] mt-[50px] rotate-[-42deg]',
                index === 1 &&
                  'absolute -ml-[102px] -mt-[75px] rotate-[-17deg]',
                index === 2 && 'absolute -mt-[43px] rotate-[26deg]',
                index === 3 &&
                  'absolute -right-[38px] mt-[80px] rotate-[49deg]',
              )}
              onMouseEnter={() => handleMouseEnter(index)}
            >
              <div
                className={cn(
                  'z-20 text-[36px] blur-0 hover:text-[#A90909]',
                  hoveredIndex === index && 'text-[#A90909]',
                )}
              >
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 300 300"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <path
                      id="curve"
                      d="M 50,150 A 350,350 0 0,1 250,150"
                      fill="transparent"
                      stroke="transparent"
                    />
                  </defs>

                  <text
                    fill={hoveredIndex === index ? 'red' : 'black'}
                    fontSize="36"
                    fontFamily="Arial"
                    letterSpacing="2"
                  >
                    <textPath
                      href="#curve"
                      startOffset="50%"
                      textAnchor="middle"
                    >
                      {item.name}
                    </textPath>
                  </text>
                </svg>
              </div>
              <div
                className={cn(
                  'absolute mt-5 size-5 rounded-full bg-[#E4E4E4]',
                  hoveredIndex === index && 'bg-red',
                )}
              />
              <div
                className={cn(
                  'opacity-1 absolute h-full w-full bg-red/30 blur-2xl',
                  hoveredIndex !== index && 'opacity-0',
                )}
              />
            </Link>
          </div>
        ))}
      </nav>
      <div className="relative mx-auto mb-20 h-[552px] w-full max-w-[1104px] md:mb-24 lg:mb-28 xl:mb-32">
        <Image
          src="/icons/slider-line.svg"
          fill={true}
          alt="slider"
          className="-z-20"
        />
        <Image
          src="/icons/slider-line-down.svg"
          className="-z-20 mt-[33px] px-[62px]"
          fill={true}
          alt="slider"
        />
      </div>
    </div>
  )
}
