'use client'
import { useState } from 'react'

interface FAQProps {
  question: string
  answer: string
}
export default function Item({ question, answer }: FAQProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-5 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
      <div
        className={
          'mx-auto flex max-w-[800px] items-center border border-black p-1 pl-4 text-[24px] transition-all duration-500 ' +
          (isOpen ? 'bg-black text-white' : 'bg-white text-black') +
          ' hover:border-gray-800 hover:bg-gray-800 hover:text-white hover:shadow-lg'
        }
      >
        {question}
        <div className="ml-auto pr-3">
          <div
            style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
            className={`ml-auto transform text-[28px] duration-500 ${
              isOpen ? 'rotate-90' : 'rotate-0'
            }`}
          >
            {'>'}
          </div>
        </div>
      </div>
      <div
        className={`transition-max-height mx-auto flex max-w-[800px] overflow-hidden duration-500 ${
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
