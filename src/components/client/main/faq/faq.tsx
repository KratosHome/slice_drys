'use client'
import { FC, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/all'

import { Item } from '@/components/client/main/faq/item'

interface IFaq {
  data: Faq[]
}

const Faq: FC<IFaq> = ({ data }) => {
  const t = useTranslations('main.faq')
  const faqRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh(true)
    }, 1)
  }, [])

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: faqRef.current[0],
      start: 'top 80%',
      end: '400px 10%',
      toggleActions: 'play reset play reset',
      preventOverlaps: true,
      onToggle: (self) => {
        if (!self.isActive) {
          gsap.set(faqRef.current, { autoAlpha: 0 })
        } else {
          gsap.fromTo(
            faqRef.current,
            { autoAlpha: 0, y: self.direction === -1 ? -50 : 50 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              stagger: {
                each: 0.2,
                from: self.direction === -1 ? 'end' : 'start',
              },
              ease: 'power1.out',
            },
          )
        }
      },
    })
    ScrollTrigger.refresh(true)
  })

  return (
    <section
      aria-labelledby="FAQ"
      className="section relative w-full max-w-[1280px] overflow-x-clip before:absolute before:-left-14 before:top-[90px] before:z-[-1] before:h-[208px] before:w-[149px] before:rotate-[73deg] before:bg-[url('/images/jerky.png')] before:bg-no-repeat after:absolute after:-right-4 after:top-[60%] after:z-[-1] after:h-[208px] after:w-[149px] after:rotate-[-27deg] after:bg-[url('/images/jerky.png')] after:bg-no-repeat 1440:overflow-x-visible lg:before:left-0"
    >
      <div className="mx-auto w-full max-w-[880px] items-center px-[20px] lg:px-0">
        <h2 className="title-section pr-0 text-center md:pr-20">
          {t('all-about-dry-fruits')}
        </h2>
        <p className="underline-wave relative mb-7 ml-auto mt-5 w-fit pb-4 text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] lg:mb-[116px]">
          {t('even-what-did-not-ask')}
        </p>
        <div className="mt-[clamp(32px,calc(32px+84*(100vw-375px)/1065),116px)]">
          {data?.map((item: Faq, i) => (
            <Item
              ref={(el) => {
                if (el) {
                  if (el) faqRef.current[i] = el
                }
              }}
              key={item.title}
              question={item.title}
              answer={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
export default Faq
