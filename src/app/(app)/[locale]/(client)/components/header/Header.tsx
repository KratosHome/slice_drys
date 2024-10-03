'use client'
import React from 'react'
import { Button } from '../button/Button'
import Link from 'next/link'
import Image from 'next/image'
import LOGO from '../../../../assets/LOGO.png'
import INSTAGRAM from '../../../../assets/LOGO_INSTAGRAM.png'
import FACEBOOK from '../../../../assets/LOGO_FACEBOOK.png'
import SEARCH from '../../../../assets/LOGO_SEARCH.png'
import BASKET from '../../../../assets/LOGO_BASKET.png'
import PHONE from '../../../../assets/LOGO_PHONE.png'
import NavBar from '../navbar/NavBar'

export default function Header() {
  return (
    <header>
      <div className="m-auto mb-6 flex h-[32px] w-[1440px] items-center justify-center bg-black text-white">
        <p className="text-base font-medium leading-6">
          Безкоштовна доставка від 1000 грн.
        </p>
      </div>
      <div className="relative m-auto flex h-[124.45px] w-[1240px] grid-cols-2 justify-between bg-[#E4E4E4] text-black">
        <div className="relative grid h-[100.45px] w-[663px] grid-cols-2">
          <div className="relative grid h-[100px] w-[375px] grid-rows-2">
            <NavBar />
            <div className="relative row-span-1 flex h-auto w-full items-end justify-end gap-[20px]">
              <Image
                src={FACEBOOK}
                alt="logo facebook"
                className="hover:scale-110"
              />
              <Image
                src={INSTAGRAM}
                alt="logo instagram"
                className="hover:scale-110"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Image src={LOGO} alt="logo" className="" />
          </div>
        </div>
        <div className="relative grid h-[100.45px] w-[482px] grid-rows-2">
          <div className="relative flex h-[50px] w-[482px] items-center justify-between">
            <nav className="flex h-[50px] w-[221px] items-center justify-between">
              <Link
                href={'/contacts'}
                className="text-xl font-normal hover:scale-110"
              >
                Контакти
              </Link>
              <Link
                href={'/delivery'}
                className="text-xl font-normal hover:scale-110"
              >
                Доставка
              </Link>
            </nav>
            <div className="flex h-[32px] w-[148px] justify-between border-2">
              <div>
                <span onClick={() => null} className="cursor-pointer">
                  UA
                </span>
                <span>/</span>
                <span onClick={() => null} className="cursor-pointer">
                  EN
                </span>
              </div>
              <Image
                src={SEARCH}
                alt="logo search"
                className="w-auto cursor-pointer hover:scale-105"
              />
              <Image
                src={BASKET}
                alt="logo basket"
                className="w-auto cursor-pointer hover:scale-105"
              />
            </div>
          </div>
          <div className="relative flex h-[50px] w-[482px] items-center justify-between">
            <div className="flex h-[24px] w-[24px] cursor-pointer items-center hover:scale-105">
              <Image src={PHONE} alt="logo phone" className="flex" />
              <span className="text-base font-medium leading-6">
                +380123456789
              </span>
            </div>
            <div className="relative flex h-[50px] w-[180px] bg-black">
              <Button
                className="flex h-full w-full items-center justify-center text-xl font-medium leading-[30px] text-white hover:scale-110"
                label="Замовити"
                onClick={() => null}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
