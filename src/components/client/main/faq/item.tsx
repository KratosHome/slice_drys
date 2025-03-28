'use client'
import { forwardRef, useState } from 'react'

import { cn } from '@/utils/cn'

interface FAQProps {
  question: string
  answer: string
}
export const Item = forwardRef<HTMLDivElement, FAQProps>(function Item(
  { question, answer },
  ref,
) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="mb-5 cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
      ref={ref}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[800px] items-center border border-black p-1 pl-4 text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] transition-all duration-500',
          isOpen ? 'bg-black text-white' : 'bg-white text-black',
          !isOpen &&
            'lg:hover:border-gray-800 lg:hover:bg-gray-800 lg:hover:text-white lg:hover:shadow-lg',
          !isOpen &&
            'active:border-gray-800 active:bg-gray-800 active:text-white active:shadow-lg',
        )}
      >
        {question}
        <div className="ml-auto pr-3">
          <div
            style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
            className={`ml-auto transform text-[28px] duration-500 ${
              isOpen ? '-rotate-90' : 'rotate-90'
            }`}
          >
            {'>'}
          </div>
        </div>
      </div>
      <div
        className={cn(
          'transition-max-height mx-auto flex max-w-[800px] overflow-hidden duration-500',
          isOpen ? 'max-h-[500px]' : 'max-h-0',
        )}
      >
        <div className="w-full items-center border border-dotted border-black p-2 pl-4 text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] backdrop-blur-[5px]">
          {answer}
        </div>
      </div>
    </div>
  )
})
