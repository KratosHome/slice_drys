import { forwardRef } from 'react'

import { cn } from '@/utils/cn'

interface ReviewsProps {
  text: string
  author: string
  variant: string
}

const quotesStyle =
  'after:leading-[1] after:block before:block before:leading-[1] relative before:absolute before:font-rubik before:left-0 before:text-[clamp(40px,calc(40px+56*(100vw-375px)/1065),96px)] before:content-["“"] after:absolute after:left-full after:bottom-0 after:font-rubik after:text-[clamp(40px,calc(40px+56*(100vw-375px)/1065),96px)] after:content-["”"]'

export const ReviewsItem = forwardRef<HTMLLIElement, ReviewsProps>(
  function ReviewsItem({ text, author, variant }, ref) {
    return (
      <li className="mx-auto my-10 w-[70%] max-w-[900px] lg:w-full" ref={ref}>
        <div
          className={cn(
            'w-full',
            variant === 'grey' &&
              `border border-black bg-[#E4E4E4] px-[clamp(16px,calc(16px+32*(100vw-375px)/1065),48px)] py-[clamp(12px,calc(12px+12*(100vw-375px)/1065),24px)] before:-top-[clamp(12px,calc(12px+12*(100vw-375px)/1065),24px)] before:translate-x-[-50%] after:translate-x-[-50%] after:translate-y-[calc(-1*clamp(6px,calc(6px+6*(100vw-375px)/1065),12px)+50%)] md:w-[92%] md:border-none ${quotesStyle}`,
            variant === 'black' &&
              'flex items-center justify-between bg-black px-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] py-[24px] text-white',
            variant === 'white' &&
              `border-[clamp(8px,calc(8px+8*(100vw-375px)/1065),16px)] border-[#E4E4E4] px-[clamp(8px,calc(8px+4*(100vw-375px)/1065),12px)] py-[clamp(4px,calc(4px+4*(100vw-375px)/1065),8px)] md:w-[89%] ${quotesStyle} before:-top-[clamp(12px,calc(12px+12*(100vw-375px)/1065),24px)] before:translate-x-[calc(-1*clamp(12px,calc(12px+8*(100vw-375px)/1065),20px)-50%)] after:translate-x-[calc(-50%+clamp(8px,calc(8px+4*(100vw-375px)/1065),12px))] after:translate-y-[calc(50%-clamp(2px,calc(2px+2*(100vw-375px)/1065),4px))]`,
          )}
        >
          <div>
            <p className="mb-[10px] font-bold">{author}</p>

            <p>{text}</p>
          </div>
          <span
            className={cn(
              'hidden translate-y-[50%] font-rubik text-[clamp(64px,calc(64px+136*(100vw-375px)/1065),200px)] leading-[0.5]',
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
