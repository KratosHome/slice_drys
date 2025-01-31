'use client'
import { useRef } from 'react'
import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import Info from './header-info'
import HamburgerMenu from './hamburger-menu'
import { useLocale, useTranslations } from 'next-intl'
import Button from '@/components/client/ui/button'
import LocaleChange from '@/components/client/header/locale-change/locale-change'
import Cart from '@/components/client/header/card/cart'
import NumberCall from '@/components/client/header/number-call/number-call'

gsap.registerPlugin(ScrollTrigger)

interface HeaderP {
  headerLinks: ILink[]
}

const Header: FC<HeaderP> = ({ headerLinks }) => {
  const t = useTranslations('main.header')
  const local = useLocale()
  const headerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLImageElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const cullRef = useRef<HTMLDivElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headerRef.current,
        start: 'top top',
        end: '+=200px',
        scrub: true,
        toggleActions: 'play none none reverse',
      },
    })

    tl.to(
      headerRef.current,
      {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        height: '60px',
        marginTop: '0px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        duration: 0.5,
        ease: 'power1.out',
      },
      0,
    )

    tl.to(
      dividerRef.current,
      {
        marginTop: '-55px',
        duration: 0.5,
        ease: 'power1.out',
      },
      0,
    )

    tl.to(
      menuRef.current,
      {
        padding: '0px 20px',
        duration: 0.5,
        ease: 'power1.out',
      },
      '<',
    )

    tl.to(
      logoRef.current,
      {
        scale: 0.3,
        y: -30,
        duration: 0.5,
        ease: 'power1.out',
      },
      '<',
    )

    tl.to(
      socialRef.current,
      {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power1.out',
      },
      '<',
    )

    tl.to(
      cullRef.current,
      {
        opacity: 0,
        y: -30,
        duration: 0.5,
        ease: 'power1.out',
      },
      '<',
    )
  })

  return (
    <>
      <Info title={`${t('free-delivery-from')}`} />
      <header
        ref={headerRef}
        className="fixed left-0 top-0 z-50 mt-6 w-full transition-all"
      >
        <div
          ref={menuRef}
          className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-3"
        >
          <div>
            <nav className="hidden gap-3 lg:flex">
              {headerLinks?.map((link: ILink) => (
                <Link
                  key={link.id}
                  href={`/${local}/${link.href}`}
                  className="hover:text-red pr-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <HamburgerMenu headerLinks={headerLinks} hamburgerLinksOther={[]} />
            <div
              ref={socialRef}
              className="mt-5 hidden justify-end gap-x-5 pr-3 lg:flex"
            >
              <Button
                variant={'icons'}
                onClick={() =>
                  window.open(
                    'https://www.facebook.com/slicedrys/',
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
              >
                <Image
                  src={'/icons/facebook.svg'}
                  alt="facebook icon"
                  width={32}
                  height={32}
                  className="cursor-pointer"
                />
              </Button>
              <Button
                variant={'icons'}
                onClick={() =>
                  window.open(
                    'https://www.instagram.com/slicedrys',
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
              >
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
              ref={logoRef}
              src={'/icons/logo.svg'}
              alt="slice drus icon"
              className="h-[70px] w-[59px] transition-transform duration-300 ease-in-out lg:h-[100px] lg:w-[86px]"
              width={86}
              height={100}
            />
          </Link>
          <div>
            <div className="flex justify-center lg:justify-end">
              <nav className="mr-[52px] hidden gap-x-3 text-[20px] lg:flex">
                <Link
                  href={`/${local}/blog`}
                  className="hover:text-red p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105"
                >
                  {t('blog')}
                </Link>
                <Link
                  href={`/${local}/opt`}
                  className="hover:text-red p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105"
                >
                  {t('wholesale')}
                </Link>
                <Link
                  href={`/${local}/contacts`}
                  className="hover:text-red p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105"
                >
                  {t('contacts')}
                </Link>
              </nav>
              <div className="flex items-center gap-x-4">
                <LocaleChange className="hidden lg:block" />
                <Cart />
              </div>
            </div>
            <div ref={cullRef} className="mt-3 flex justify-between">
              <NumberCall className="hidden lg:flex" />
              <Button type="button" variant="button">
                {t('order')}
              </Button>
            </div>
          </div>
        </div>
        <div
          ref={dividerRef}
          className="mx-auto mt-6 h-[1px] w-full max-w-[1240px] bg-[#E4E4E4]"
        />
      </header>
    </>
  )
}

export default Header
