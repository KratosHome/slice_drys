'use client'
import { useState } from 'react'
import ARROW from '@/assets/Arrow.png'
import Image from 'next/image'
import Link from 'next/link'

export default function DropDown() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <div className="ml-4 flex items-center justify-between hover:scale-110">
        <p className="text-xl">Головна</p>
        <Image
          src={ARROW}
          alt="arrow"
          className="z-50 ml-4 mt-1 text-xl font-medium hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {isOpen && (
        <div className="p-12-8-12-8 absolute z-50 ml-4 flex h-[170px] w-[193px] flex-col rounded-[2px] border border-black bg-[#E4E4E4]">
          <Link
            href="/about-us"
            className="ml-4 w-[165px] cursor-pointer border-black text-xl leading-[30px] text-black hover:border-b-[1px] hover:font-medium"
          >
            Про нас
          </Link>
          <Link
            href="/popular"
            className="ml-4 w-[165px] cursor-pointer border-black text-xl leading-[30px] text-black hover:border-b-[1px] hover:font-medium"
          >
            Популярне
          </Link>
          <Link
            href="/promotions"
            className="ml-4 w-[165px] cursor-pointer border-black text-xl leading-[30px] text-black hover:border-b-[1px] hover:font-medium"
          >
            Акції
          </Link>
          <Link
            href="/faq"
            className="ml-4 w-[165px] cursor-pointer border-black text-xl leading-[30px] text-black hover:border-b-[1px] hover:font-medium"
          >
            FAQ
          </Link>
          <Link
            href="/reviews"
            className="ml-4 w-[165px] cursor-pointer border-black text-xl leading-[30px] text-black hover:border-b-[1px] hover:font-medium"
          >
            Відгуки
          </Link>
        </div>
      )}
    </div>
  )
}
