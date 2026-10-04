import { useTranslations } from 'next-intl'
import UnderlineWave from '@/components/ui/underline-wave'
import ReviewsContent from './reviews-content'
import { ReviewsItem } from './reviews-item'

interface IReviewDisplay {
  _id: number
  author: string
  text: string
}

interface IReviewsProps {
  reviews: IReviewDisplay[]
  title?: string
  pagination?: boolean
}

const VARIANTS = ['grey', 'black', 'white'] as const

export default function Reviews({
  reviews,
  title,
  pagination = false,
}: IReviewsProps) {
  const t = useTranslations('main.reviews')

  if (reviews.length === 0) return null

  return (
    <ReviewsContent
      reviewIds={reviews.map((review) => review._id)}
      pagination={pagination}
      addReviewLabel={t('add-new-review')}
      heading={
        <>
          <h2 id="reviews" className="title-section text-center">
            {title || t('title')}
          </h2>
          <p className="relative mt-5 mb-8 hidden pb-2 text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] md:ml-auto md:block md:w-fit lg:pb-4">
            {t('say-those')}
            <UnderlineWave />
          </p>
        </>
      }
    >
      {reviews.map((review, index) => (
        <ReviewsItem
          id={`review-${review._id}`}
          key={review._id}
          author={review.author}
          text={review.text}
          variant={VARIANTS[index % VARIANTS.length]}
        />
      ))}
    </ReviewsContent>
  )
}
