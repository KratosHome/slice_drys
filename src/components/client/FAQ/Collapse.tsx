'use client'
import { useState } from 'react'

interface FAQProps {
  question: string
  answer: string
}
export default function FAQ({ question, answer }: FAQProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-5">
      <div
        className={
          'mx-auto flex max-w-[800px] items-center border border-black p-2 pl-4 text-[24px] ' +
          (isOpen ? 'bg-black text-white' : '')
        }
      >
        {question}
        <div className="ml-auto pr-3">
          <div
            style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
            className="ml-auto mt-3 rotate-90 cursor-pointer text-[28px]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {'>'}
          </div>
        </div>
      </div>
      <div
        className={`transition-max-height mx-auto flex max-w-[800px] overflow-hidden duration-1000 ${
          isOpen ? 'max-h-[500px]' : 'max-h-0'
        }`}
      >
        <div className="w-full items-center border border-dotted border-black p-2 pl-4 text-[24px]">
          {answer}
        </div>
      </div>
    </div>
  )
}
