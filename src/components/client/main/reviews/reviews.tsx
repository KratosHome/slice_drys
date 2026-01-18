'use client'

import { ReviewsItem } from './reviews-item'
import { UnderlinedLink } from '@/components/ui/underlined-link'
import {
  ClientDialogContent,
  ClientDialogHeader,
  Dialog,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import UnderlineWave from '@/components/ui/underline-wave'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { useEffect, useRef, useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useForm } from 'react-hook-form'
import { toast } from '@/hooks/useToast'
import { sendReviews } from '@/server/info/send-reviews.server'
import { cn } from '@/utils/cn'
import { getPaginationRange } from '@/utils/get-pagination-range'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface IFormData {
  name: string
  text: string
}

interface IReviewsProps {
  reviews: IReviewLocal[]
  title?: string
  pagination?: boolean
}

export default function Reviews({
  reviews,
  title,
  pagination = false,
}: IReviewsProps) {
  const VARIANTS = useMemo(() => ['grey', 'black', 'white'] as const, [])

  const REVIEWS_PER_SET = 6

  const t = useTranslations('main.reviews')
  const reviewsRef = useRef<HTMLLIElement[]>([])
  const [displayedReviewsSet, setDisplayedReviewsSet] = useState<number>(1)
  const [isReviewsOpen, setIsReviewsOpen] = useState<boolean>(false)

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      ScrollTrigger.refresh(true)
    }, 1)

    return () => clearTimeout(timeoutID)
  }, [])

  useGSAP(() => {
    reviewsRef.current.forEach((review, index) => {
      gsap.from(review, {
        x: index % 2 ? 200 : -200,
        autoAlpha: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: review,
          start: 'top bottom',
          end: '200px top',
          toggleActions: 'play reset play reset',
        },
      })
    })
    ScrollTrigger.refresh(true)
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IFormData>({
    defaultValues: {
      name: '',
      text: '',
    },
  })

  const sendCall = async (data: IFormData): Promise<void> => {
    await sendReviews({
      name: data.name,
      text: data.text,
    })

    toast({
      title: t('thanks-for-the-feedback'),
    })

    reset()
    setIsReviewsOpen(false)
  }

  const currentReviewsSet: IReviewLocal[] = reviews.slice(
    (displayedReviewsSet - 1) * REVIEWS_PER_SET,
    displayedReviewsSet * REVIEWS_PER_SET,
  )

  const totalPages: number = Math.ceil(reviews.length / REVIEWS_PER_SET)

  const currentPage: number = displayedReviewsSet

  if (reviews.length === 0) return null

  return (
    <section
      aria-labelledby="reviews"
      className="section 1440:overflow-visible relative w-full max-w-[1280px] overflow-x-clip before:absolute before:top-[50px] before:-left-14 before:z-[-1] before:h-[208px] before:w-[149px] before:rotate-[73deg] before:bg-no-repeat after:absolute after:top-[-10px] after:-right-20 after:z-[-1] after:h-[208px] after:w-[149px] after:rotate-[-27deg] after:bg-[url('/images/jerky.webp')] after:bg-no-repeat md:before:bg-[url('/images/jerky.webp')] md:after:top-[40%] md:after:-right-4 lg:before:left-0"
    >
      <span className="absolute inset-0 z-[-1] before:absolute before:bottom-[210px] before:-left-24 before:z-[-1] before:h-[195px] before:w-[243px] before:rotate-[0deg] before:bg-no-repeat md:before:bg-[url('/images/jerky1.webp')]" />
      <div className="mx-auto w-full max-w-[910px] px-[20px] pb-[50px] lg:px-0">
        <h2 id="reviews" className="title-section text-center">
          {title ? title : t('title')}
        </h2>
        <p className="relative mt-5 mb-8 hidden pb-2 text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] md:ml-auto md:block md:w-fit lg:pb-4">
          {t('say-those')}
          <UnderlineWave />
        </p>
        <ul className="mt-[clamp(23px,calc(23px+87*(100vw-375px)/1065),100px)]">
          {currentReviewsSet.map((review, index) => (
            <ReviewsItem
              id={`review-${review._id}`}
              ref={(el) => {
                if (el) reviewsRef.current[index] = el
              }}
              key={review._id}
              author={review.author}
              text={review.text}
              variant={VARIANTS[index % VARIANTS.length]}
            />
          ))}
        </ul>

        {totalPages > 1 && pagination ? (
          <Pagination className="mt-[60px] md:mt-[120px]">
            <PaginationContent>
              <PaginationItem
                className={cn(currentPage === 1 && 'cursor-auto')}
              >
                <PaginationPrevious
                  className="text-[36px] md:text-[64px]"
                  disabled={currentPage === 1}
                  href={`#review-${
                    currentPage - 2 > 0
                      ? reviews[(currentPage - 2) * REVIEWS_PER_SET]._id
                      : reviews[0]._id
                  }`}
                  onClick={() =>
                    setDisplayedReviewsSet(
                      currentPage === 1 ? 1 : currentPage - 1,
                    )
                  }
                />
              </PaginationItem>
              {getPaginationRange(currentPage, totalPages).map(
                (item, index) => {
                  if (item === 'ellipsis') {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis className="text-xl sm:text-2xl md:text-4xl" />
                      </PaginationItem>
                    )
                  }
                  return (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href={`#review-${reviews[(item - 1) * REVIEWS_PER_SET]._id}`}
                        disabled={currentPage === item}
                        isActive={currentPage === item}
                        className="text-xl sm:text-2xl md:text-4xl"
                        onClick={() => setDisplayedReviewsSet(item)}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                },
              )}

              <PaginationItem
                className={cn(currentPage === totalPages && 'cursor-auto')}
              >
                <PaginationNext
                  className="text-[36px] md:text-[64px]"
                  disabled={currentPage === totalPages}
                  href={`#review-${
                    currentPage !== totalPages
                      ? reviews[currentPage * REVIEWS_PER_SET]._id
                      : reviews[(currentPage - 1) * REVIEWS_PER_SET]._id
                  }`}
                  onClick={() =>
                    setDisplayedReviewsSet(
                      currentPage === totalPages ? totalPages : currentPage + 1,
                    )
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        ) : null}
      </div>
      <Dialog open={isReviewsOpen} onOpenChange={setIsReviewsOpen}>
        <DialogTrigger asChild>
          <UnderlinedLink
            as="button"
            className="order-1 max-w-max cursor-pointer md:order-0"
          >
            {t('add-new-review')}
          </UnderlinedLink>
        </DialogTrigger>
        <ClientDialogContent className="overflow-hidden border-none bg-transparent p-0 sm:max-w-[500px]">
          <ClientDialogHeader className="bg-foreground text-background p-6">
            <DialogTitle className="font-rubik text-center text-[32px]">
              {t('add-new-review')}
            </DialogTitle>
          </ClientDialogHeader>
          <form
            onSubmit={handleSubmit(sendCall)}
            className="bg-background grid gap-4 p-6"
          >
            <div className="flex flex-col items-start">
              <Input
                autoFocus
                id="name"
                placeholder={t('name')}
                {...register('name', { required: `${t('enter-name')}` })}
              />

              {errors.name ? (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              ) : null}
            </div>
            <div className="flex flex-col items-start">
              <Textarea
                id="text"
                placeholder={t('feedback')}
                className="h-[200px] resize-none"
                {...register('text', { required: `${t('enter-text')}` })}
              />

              {errors.text ? (
                <p className="text-sm text-red-500">{errors.text.message}</p>
              ) : null}
            </div>

            <div className="flex justify-between gap-3">
              <Button
                variant="button"
                className="bg-background text-foreground border-foreground hover:bg-background! hover:text-accent-foreground w-full border-1 shadow-xs"
                onClick={() => setIsReviewsOpen(false)}
              >
                {t('back')}
              </Button>
              <Button type="submit" variant="button" className="w-full">
                {t('send')}
              </Button>
            </div>
          </form>
        </ClientDialogContent>
      </Dialog>
    </section>
  )
}
