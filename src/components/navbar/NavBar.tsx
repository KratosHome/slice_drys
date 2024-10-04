'use client'
import React from 'react'
import Link from 'next/link'
import DropDown from '../dropdown/DropDown'

export default function NavBar() {
  return (
    <nav className="relative flex items-center justify-between">
      <DropDown />
      <Link href={'/catalog'} className="text-xl font-normal hover:scale-110">
        Каталог
      </Link>
      <Link href={'/blog'} className="text-xl font-normal hover:scale-110">
        Блог
      </Link>
      <Link href={'/sale'} className="text-xl font-normal hover:scale-110">
        Опт
      </Link>
    </nav>
  )
}
