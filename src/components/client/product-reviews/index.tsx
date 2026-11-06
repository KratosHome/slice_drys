'use client'

import { useId, useState } from 'react'
import type {
  ProductReview,
  ProductReviewReply,
  ProductReviewsData,
} from '@/types/product-review'
import { reviewCopy, type ReviewLocale } from './copy'
import { ReviewForm } from './review-form'
import { ReviewPhotoGallery } from './photo-gallery'
import { ReviewStars } from './stars'

function ReviewAuthor({
  review,
  locale,
}: {
  review: ProductReviewReply
  locale: ReviewLocale
}) {
  const date = new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    dateStyle: 'medium',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(review.createdAt))
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
      <span className="font-semibold">{review.author}</span>
      {review.isStoreRepresentative && (
        <span className="bg-foreground/5 rounded-full px-2 py-0.5 text-xs font-medium">
          {reviewCopy[locale].store}
        </span>
      )}
      <time dateTime={review.createdAt} className="text-muted-foreground">
        {date}
      </time>
    </div>
  )
}

function ReviewItem({
  review,
  productId,
  locale,
}: {
  review: ProductReview
  productId: string
  locale: ReviewLocale
}) {
  const copy = reviewCopy[locale]
  const [replying, setReplying] = useState(false)
  const replyId = useId()
  return (
    <article
      id={`review-${review.id}`}
      className="border-foreground/10 border-b py-6 last:border-b-0"
    >
      <ReviewAuthor review={review} locale={locale} />
      <div className="mt-2">
        <ReviewStars
          rating={review.rating}
          label={`${review.rating} ${copy.outOf}`}
        />
      </div>
      <p className="mt-3 text-sm leading-7 wrap-anywhere whitespace-pre-wrap sm:text-base">
        {review.text}
      </p>
      <ReviewPhotoGallery
        photos={review.photos}
        author={review.author}
        locale={locale}
      />
      {review.replies.length > 0 && (
        <ul
          aria-label={copy.replyingTo}
          className="border-foreground/15 mt-5 space-y-5 border-l-2 pl-4 sm:pl-6"
        >
          {review.replies.map((reply) => (
            <li key={reply.id} id={`review-${reply.id}`}>
              <ReviewAuthor review={reply} locale={locale} />
              <p className="mt-2 text-sm leading-6 wrap-anywhere whitespace-pre-wrap">
                {reply.text}
              </p>
            </li>
          ))}
        </ul>
      )}
      <button
        type="button"
        aria-expanded={replying}
        aria-controls={replyId}
        onClick={() => setReplying((value) => !value)}
        className="mt-4 rounded-sm text-sm font-medium underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        {replying ? copy.cancel : copy.reply}
      </button>
      <div id={replyId}>
        {replying && (
          <ReviewForm
            productId={productId}
            parentId={review.id}
            locale={locale}
          />
        )}
      </div>
    </article>
  )
}

export function ProductReviews({
  data,
  locale,
}: {
  data: ProductReviewsData
  locale: ReviewLocale
}) {
  const copy = reviewCopy[locale]
  const hasRatings = data.ratingCount > 0 && data.averageRating !== null
  const average = hasRatings
    ? new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(
        data.averageRating!,
      )
    : null

  return (
    <section
      id="product-reviews"
      aria-labelledby="product-reviews-title"
      className="border-foreground/10 my-10 scroll-mt-24 border-t pt-8 sm:my-14"
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h2
            id="product-reviews-title"
            className="text-2xl font-semibold sm:text-3xl"
          >
            {copy.title}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">{copy.shared}</p>
          {hasRatings ? (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <strong className="text-2xl">
                {average}{' '}
                <span className="text-muted-foreground text-sm font-normal">
                  / 5
                </span>
              </strong>
              <ReviewStars
                rating={data.averageRating!}
                label={`${average} ${copy.outOf}`}
              />
              <span className="text-muted-foreground text-sm">
                {copy.count}: {data.ratingCount}
              </span>
            </div>
          ) : (
            <p className="mt-4 text-base">{copy.empty}</p>
          )}
        </div>
      </div>
      <div className="border-foreground/10 mt-6 rounded-xl border p-4 sm:p-6">
        <ReviewForm productId={data.productId} locale={locale} />
      </div>
      {data.reviews.length > 0 && (
        <div className="mt-5">
          {data.reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              productId={data.productId}
              locale={locale}
            />
          ))}
        </div>
      )}
    </section>
  )
}
