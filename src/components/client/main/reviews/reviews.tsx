'use client'
import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

import { ReviewsItem } from '@/components/client/main/reviews/reviews-item'

import { reviewsData } from '@/data/main/reviews'

const variants = ['grey', 'black', 'white']

export default function Reviews() {
  const t = useTranslations('main.reviews')
  const reviewsRef = useRef<HTMLLIElement[]>([])
  const locale: ILocale = useLocale() as ILocale

  useGSAP(() => {
    reviewsRef.current.forEach((r, i) => {
      gsap.from(r, {
        x: i % 2 ? 200 : -200,
        autoAlpha: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: r,
          start: 'top 80%',
        },
      })
    })
  })

  return (
    <section
      aria-labelledby="reviews"
      className="section relative w-full max-w-[1280px] overflow-x-clip before:absolute before:-left-14 before:top-[50px] before:z-[-1] before:h-[208px] before:w-[149px] before:rotate-[73deg] before:bg-no-repeat after:absolute after:-right-20 after:top-[-10px] after:z-[-1] after:h-[208px] after:w-[149px] after:rotate-[-27deg] after:bg-[url('/images/jerky.png')] after:bg-no-repeat 1440:overflow-visible md:before:bg-[url('/images/jerky.png')] md:after:-right-4 md:after:top-[40%] lg:before:left-0"
    >
      <span className="absolute inset-0 z-[-1] before:absolute before:-left-24 before:bottom-[210px] before:z-[-1] before:h-[195px] before:w-[243px] before:rotate-[0deg] before:bg-no-repeat md:before:bg-[url('/images/jerky1.png')]"></span>
      <div className="mx-auto w-full max-w-[910px] px-[20px] lg:px-0">
        <h2 className="title-section text-center">{t('title')}</h2>
        <p className="slider-label relative mb-8 mt-5 hidden place-content-end text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] md:grid">
          {t('say-those')}
        </p>
        <ul className="mt-[clamp(23px,calc(23px+87*(100vw-375px)/1065),100px)]">
          {reviewsData[locale].map((review, index) => (
            <ReviewsItem
              ref={(el) => {
                if (el) reviewsRef.current[index] = el
              }}
              key={index}
              author={review.author}
              text={review.text}
              variant={variants[index % variants.length]}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
