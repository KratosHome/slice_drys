'use client'
import { useRef } from 'react'
import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import Info from './header-info'
import HamburgerMenu from './hamburger-menu'
import { useLocale } from 'next-intl'
import Button from '@/components/client/ui/button'
import LocaleChange from '@/components/client/locale-change/locale-change'
import Cart from '@/components/client/card/cart'
import Search from '@/components/client/search/search'
import NumberCall from '@/components/client/number-call/number-call'

interface HeaderP {
  headerLinks: ILink[]
}

const Header: FC<HeaderP> = ({ headerLinks }) => {
  const local = useLocale()
  const headerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      headerRef.current,
      { yPercent: -200, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
      },
    )
  })

  return (
    <header>
      <Info title="Безкоштовна доставка від 1000 грн." />
      <div
        ref={headerRef}
        className="mx-auto mt-6 box-border flex max-w-[1280px] items-center justify-between px-5 opacity-0"
      >
        <div>
          <nav className="hidden gap-3 lg:flex">
            {headerLinks?.map((link: ILink) => (
              <Link
                key={link.id}
                href={link.href}
                className="p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105 hover:text-red"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <HamburgerMenu headerLinks={headerLinks} hamburgerLinksOther={[]} />
          <div className="mt-5 hidden justify-end gap-x-5 pr-3 lg:flex">
            <Button variant={'icons'}>
              <Image
                src={'/icons/facebook.svg'}
                alt="facebook icon"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </Button>
            <Button variant={'icons'}>
              <Image
                src={'/icons/instagram.svg'}
                alt="insta icon"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </Button>
          </div>
        </div>
        <Link href={`/${local}`} className="ml-[55px]">
          <Image
            src={'/icons/logo.svg'}
            alt="slice drus icon"
            className="h-[70px] w-[59px] lg:h-[100px] lg:w-[86px]"
            width={86}
            height={100}
          />
        </Link>
        <div>
          <div className="flex justify-center lg:justify-end">
            <nav className="mr-[52px] hidden gap-x-3 text-[20px] lg:flex">
              <Link
                href={`/${local}/blog`}
                className="p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105 hover:text-red"
              >
                Блог
              </Link>
              <Link
                href={`/${local}/opt`}
                className="p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105 hover:text-red"
              >
                Опт
              </Link>
              <Link
                href={`/${local}/contacts`}
                className="p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105 hover:text-red"
              >
                Контакти
              </Link>
            </nav>
            <div className="flex items-center gap-x-4">
              <LocaleChange className="hidden lg:block" />
              <Search />
              <Cart />
            </div>
          </div>
          <div className="mt-3 flex justify-between">
            <NumberCall className="hidden lg:flex" />
            <Button type="button" variant="button">
              Замовити
            </Button>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-6 h-[1px] w-full max-w-[1240px] justify-between bg-[#E4E4E4]" />
    </header>
  )
}

export default Header
