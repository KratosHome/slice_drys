'use client'

import { forwardRef, useId, useState } from 'react'
import { cn } from '@/utils/cn'

interface IFaqItemProps {
  question: string
  answer: string
}
export const Item = forwardRef<HTMLDivElement, IFaqItemProps>(function Item(
  { question, answer },
  ref,
) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const questionId = useId()
  const answerId = useId()

  return (
    <div className="mb-5" ref={ref}>
      <h3>
        <button
          id={questionId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={() => setIsOpen((open) => !open)}
          className={cn(
            'mx-auto flex w-full max-w-[800px] cursor-pointer items-center border border-current p-1 pl-4 text-left text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] transition-all duration-300 select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current',
            isOpen
              ? 'bg-foreground text-background'
              : 'bg-background text-foreground',
            !isOpen &&
              'lg:hover:border-gray-800 lg:hover:bg-gray-800 lg:hover:text-white lg:hover:shadow-lg',
            !isOpen &&
              'active:border-gray-800 active:bg-gray-800 active:text-white active:shadow-lg',
          )}
        >
          {question}
          <div className="ml-auto pr-3" aria-hidden="true">
            <div
              style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
              className={`ml-auto transform text-[28px] duration-300 select-none ${
                isOpen ? '-rotate-90' : 'rotate-90'
              }`}
            >
              {'>'}
            </div>
          </div>
        </button>
      </h3>
      <div
        id={answerId}
        role="region"
        aria-labelledby={questionId}
        aria-hidden={!isOpen}
        className={cn(
          'transition-max-height mx-auto flex max-w-[800px] overflow-hidden duration-300',
          isOpen ? 'max-h-[500px]' : 'max-h-0',
        )}
      >
        <div className="w-full items-center border-2 border-t-0 border-dotted border-current p-2 pl-4 text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] backdrop-blur-[5px]">
          {answer}
        </div>
      </div>
    </div>
  )
})
