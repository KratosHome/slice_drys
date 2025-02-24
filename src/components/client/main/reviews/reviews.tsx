import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'

import ReviewsItem from '@/components/client/main/reviews/reviews-item'

import { reviewsData } from '@/data/main/reviews'

const variants = ['grey', 'black', 'white']

export default function Reviews() {
  const t = useTranslations('main.reviews')

  const locale: ILocale = useLocale() as ILocale
  return (
    <section
      aria-labelledby="reviews"
      className="section 1440:overflow-visible relative w-full max-w-[1440px] overflow-x-clip before:absolute before:-left-14 before:top-[50px] before:z-[-1] before:h-[208px] before:w-[149px] before:rotate-[73deg] before:bg-no-repeat after:absolute after:-right-20 after:top-[-10px] after:z-[-1] after:h-[208px] after:w-[149px] after:rotate-[-27deg] after:bg-[url('/images/jerky.png')] after:bg-no-repeat md:before:bg-[url('/images/jerky.png')] md:after:-right-4 md:after:top-[40%] lg:before:left-0"
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
