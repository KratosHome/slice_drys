'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'

import { ReviewsItem } from '@/components/client/main/reviews/reviews-item'
import { UnderlinedLink } from '@/components/client/ui/underlined-link'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/client/ui/dialog'
import Button from '@/components/client/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Textarea } from '@/components/admin/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { sendReviews } from '@/server/info/send-reviews.server'

const variants = ['grey', 'black', 'white']

interface FormData {
  name: string
  text: string
}

interface ReviewsProps {
  reviews: IReview[]
}

export default function Reviews({ reviews }: ReviewsProps) {
  const t = useTranslations('main.reviews')
  const reviewsRef = useRef<HTMLLIElement[]>([])

  const [isReviewsOpen, setIsReviewsOpen] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh(true)
    }, 1)
  }, [])

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
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      text: '',
    },
  })

  const sendCall = async (data: FormData) => {
    await sendReviews({
      name: data.name,
      text: data.text,
    })

    toast({
      title: t('thanks_for_the_feedback'),
    })

    reset()
    setIsReviewsOpen(false)
  }

  return (
    <section
      aria-labelledby="reviews"
      className="section relative w-full max-w-[1280px] overflow-x-clip before:absolute before:-left-14 before:top-[50px] before:z-[-1] before:h-[208px] before:w-[149px] before:rotate-[73deg] before:bg-no-repeat after:absolute after:-right-20 after:top-[-10px] after:z-[-1] after:h-[208px] after:w-[149px] after:rotate-[-27deg] after:bg-[url('/images/jerky.webp')] after:bg-no-repeat 1440:overflow-visible md:before:bg-[url('/images/jerky.webp')] md:after:-right-4 md:after:top-[40%] lg:before:left-0"
    >
      <span className="absolute inset-0 z-[-1] before:absolute before:-left-24 before:bottom-[210px] before:z-[-1] before:h-[195px] before:w-[243px] before:rotate-[0deg] before:bg-no-repeat md:before:bg-[url('/images/jerky1.webp')]"></span>
      <div className="mx-auto w-full max-w-[910px] px-[20px] pb-[50px] lg:px-0">
        <h2 className="title-section text-center">{t('title')}</h2>
        <p className="underline-wave relative mb-8 mt-5 hidden pb-2 text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] md:ml-auto md:block md:w-fit lg:pb-4">
          {t('say-those')}
        </p>
        <ul className="mt-[clamp(23px,calc(23px+87*(100vw-375px)/1065),100px)]">
          {reviews.map((review, index) => (
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
      <Dialog open={isReviewsOpen} onOpenChange={setIsReviewsOpen}>
        <DialogTrigger asChild>
          <UnderlinedLink as="button" className="md:order-0 order-1 max-w-max">
            {t('add_new_review')}
          </UnderlinedLink>
        </DialogTrigger>
        <DialogContent className="border-none sm:max-w-[425px]">
          <DialogHeader className="absolute left-0 -mt-[1px] flex h-[86px] w-full items-center justify-center bg-black text-white sm:rounded-lg">
            <DialogTitle className="text-center font-rubik text-[32px]">
              {t('add_new_review')}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(sendCall)}
            className="mt-16 grid gap-4 py-4"
          >
            <div className="flex flex-col items-start">
              <Input
                id="name"
                placeholder={t('name')}
                {...register('name', { required: `${t('enter_name')}` })}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>
            <div className="flex flex-col items-start">
              <Textarea
                id="text"
                placeholder={t('feedback')}
                className="h-[200px] resize-none"
                {...register('text', { required: `${t('enter_text')}` })}
              />
              {errors.text && (
                <p className="text-sm text-red-500">{errors.text.message}</p>
              )}
            </div>

            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setIsReviewsOpen(false)}
              >
                {t('back')}
              </Button>
              <Button type="submit" variant="button" className="w-full">
                {t('send')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
