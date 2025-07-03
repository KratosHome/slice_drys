'use client'

import { forwardRef } from 'react'
import { cn } from '@/utils/cn'

interface IReviewsItemProps {
  text: string
  author: string
  variant: string
  id: string
}

const quotesStyle =
  'after:leading-none after:block before:block before:leading-none relative before:absolute before:font-rubik before:left-0 before:text-[clamp(40px,calc(40px+56*(100vw-375px)/1065),96px)] before:content-["“"] after:absolute after:left-full after:bottom-0 after:font-rubik after:text-[clamp(40px,calc(40px+56*(100vw-375px)/1065),96px)] after:content-["”"] after:text-foreground before:text-foreground dark:before:text-foreground dark:after:text-foreground'

export const ReviewsItem = forwardRef<HTMLLIElement, IReviewsItemProps>(
  function ReviewsItem({ text, author, variant, id }, ref) {
    return (
      <li
        id={id}
        className="mx-auto my-10 w-[70%] max-w-[900px] scroll-m-20 lg:w-full"
        ref={ref}
      >
        <div
          className={cn(
            'w-full',
            variant === 'grey' &&
              `bg-grey-review border px-[clamp(16px,calc(16px+32*(100vw-375px)/1065),48px)] py-[clamp(12px,calc(12px+12*(100vw-375px)/1065),24px)] before:-top-[clamp(12px,calc(12px+12*(100vw-375px)/1065),24px)] before:translate-x-[-50%] after:translate-x-[-50%] after:translate-y-[calc(-1*clamp(6px,calc(6px+6*(100vw-375px)/1065),12px)+50%)] md:w-[92%] md:border-none ${quotesStyle}`,
            variant === 'black' &&
              'bg-black-review text-background flex items-center justify-between px-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] py-[24px]',
            variant === 'white' &&
              `border-grey-review border-[clamp(8px,calc(8px+8*(100vw-375px)/1065),16px)] px-[clamp(8px,calc(8px+4*(100vw-375px)/1065),12px)] py-[clamp(4px,calc(4px+4*(100vw-375px)/1065),8px)] md:w-[89%] ${quotesStyle} before:-top-[clamp(12px,calc(12px+12*(100vw-375px)/1065),24px)] before:translate-x-[calc(-1*clamp(12px,calc(12px+8*(100vw-375px)/1065),20px)-50%)] after:translate-x-[calc(-50%+clamp(8px,calc(8px+4*(100vw-375px)/1065),12px))] after:translate-y-[calc(50%-clamp(2px,calc(2px+2*(100vw-375px)/1065),4px))]`,
          )}
        >
          <div>
            <p className="mb-[10px] font-bold">{author}</p>
            <p>{text}</p>
          </div>
          <span
            className={cn(
              'font-rubik hidden translate-y-[50%] text-[clamp(64px,calc(64px+136*(100vw-375px)/1065),200px)] leading-[0.5]',
              variant === 'black' && 'block',
            )}
          >
            “
          </span>
        </div>
      </li>
    )
  },
)
