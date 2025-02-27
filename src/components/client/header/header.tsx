'use client'

import type { FC } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import Info from './header-info'
import HamburgerMenu from './hamburger-menu'
import LocaleChange from '@/components/client/header/locale-change/locale-change'
import Cart from '@/components/client/header/card/cart'
import NumberCall from '@/components/client/header/number-call/number-call'
import CallMe from '@/components/client/header/call-me'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLocale, useTranslations } from 'next-intl'
import { pageLinks } from '@/data/main/nav-links'
import Socials from '../ui/Socials'

gsap.registerPlugin(ScrollTrigger)

interface HeaderP {
  productLinks: ILink[]
  links: ICategory[]
}

const Header: FC<HeaderP> = ({ productLinks, links }) => {
  const t = useTranslations('main.header')
  const locale = useLocale() as ILocale
  const headerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const callRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        defaults: { duration: 0.5, ease: 'power1.out' },
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
          height: '80px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          duration: 0.5,
          ease: 'power1.out',
        },
        0,
      )

      tl.to(logoRef.current, { height: 55, }, '<')
      tl.to(socialRef.current, { autoAlpha: 0, display: 'none',  marginTop: -30, scale: 0.5 }, '<')
      tl.to(callRef.current, { autoAlpha: 0, display: 'none',  marginTop: -30, scale: 0.5 }, '<')
    })

    mm.add('(max-width: 1023px)', () => {
      const tl = gsap.timeline({
        defaults: { duration: 0.4, ease: 'power1.out' },
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
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(5px)',
          marginTop: '0px',
          boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.08)',
          duration: 0.5,
          ease: 'power1.out',
        },
        0,
      )

      tl.to(logoRef.current, { height: 55, }, '<')
      tl.to(callRef.current, { opacity: 0, display: 'none', marginTop: -30, scale: 0.5 }, '<')
    })
  })

  return (
    <>
      <Info title={`${t('free-delivery-from')}`} />
      <header
        ref={headerRef}
        className="sticky top-0 z-50 mx-auto mt-8 w-full max-w-[1240px] border-b-[1px] border-[#E4E4E4] px-5"
      >
        <div
          ref={menuRef}
          className="mx-auto grid h-full max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center justify-between py-3"
        >
          <div className="max-w-min">
            <nav className="hidden gap-3 lg:flex">
              {links.slice(0, 4)?.map((link) => (
                <Link
                  key={link.slug}
                  href={`/${locale}/${link.slug}`}
                  className="pr-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105 hover:text-red-500"
                >
                  {link.name[locale]}
                </Link>
              ))}
            </nav>
            <HamburgerMenu
              productLinks={productLinks?.slice(0, 4)}
              hamburgerLinksOther={pageLinks[locale].slice(1, 5)}
            />
            <div
              ref={socialRef}
              className="mt-5 hidden justify-end gap-x-5 pr-3 lg:flex"
            >
              <Socials variant="dark" />
            </div>
          </div>
          <Link
            ref={logoRef}
            href={`/${locale}`}
            className="h-full self-start"
          >
            <Image
              src={'/icons/logo.svg'}
              alt={`${t('logo')}`}
              className="h-full"
              width={86}
              height={100}
            />
          </Link>

          <div className="justify-self-end">
            <div className="flex justify-end lg:gap-x-[clamp(20px,calc(20px+60*(100vw-1024px)/316),80px)] lg:justify-between">
              <nav className="hidden gap-x-[10px] text-[20px] lg:flex">
                {pageLinks[locale].slice(1, 4)?.map((link: ILink) => (
                  <Link
                    key={link.id}
                    href={`/${locale}/${link.href}`}
                    className="p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105 hover:text-red-500"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div
                ref={cartRef}
                className="flex items-center justify-center gap-x-4 lg:justify-between"
              >
                <LocaleChange className="hidden lg:block" />
                <Cart />
              </div>
            </div>

            <div ref={callRef} className="flex justify-between origin-top-right">
              <NumberCall className="hidden lg:flex" />
              <CallMe />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
