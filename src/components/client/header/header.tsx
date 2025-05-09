'use client'
import Info from './header-info'
import HamburgerMenu from './hamburger-menu'
import LocaleChange from '@/components/client/header/locale-change/locale-change'
import SmallCart from '@/components/client/header/small-cart/small-cart'
import CallMe from '@/components/client/header/call-me'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLocale, useTranslations } from 'next-intl'
import { pageLinks } from '@/data/main/nav-links'
import ThemeToggle from '../theme-toggle/theme-toggle'
import NumberCall from '@/components/client/number-call/number-call'
import Socials from '@/components/ui/socials'
import { TransitionLink } from '@/components/client/transition-link/transition-link'

gsap.registerPlugin(ScrollTrigger)

interface IHeaderProps {
  productLinks: ICategory[]
}

const Header = ({ productLinks }: IHeaderProps) => {
  const t = useTranslations('main.header')
  const locale = useLocale() as ILocale
  const headerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const callRef = useRef<HTMLDivElement>(null)
  const cartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTimeout(() => {
      ScrollTrigger.refresh(true)
    }, 1)
  }, [])

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const tl = gsap.timeline({
        defaults: { duration: 0.5, ease: 'power1.out' },
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top top',
          end: '+=100px',
          scrub: true,
          toggleActions: 'play none none reverse',
        },
      })

      tl.to(
        headerRef.current,
        {
          opacity: 0.9,
          backdropFilter: 'blur(10px)',
          height: '80px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          duration: 0.5,
          ease: 'power1.out',
        },
        0,
      )

      tl.to(logoRef.current, { height: 55 }, '<')
      tl.to(
        socialRef.current,
        {
          autoAlpha: 0,
          display: 'none',
          marginTop: -30,
          scale: 0.5,
          pointerEvents: 'none',
        },
        '<',
      )
      tl.to(
        callRef.current,
        {
          autoAlpha: 0,
          display: 'none',
          marginTop: -30,
          scale: 0.5,
          pointerEvents: 'none',
        },
        '<',
      )
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
          opacity: 0.95,
          backdropFilter: 'blur(5px)',
          marginTop: '0px',
          boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.08)',
          duration: 0.5,
          ease: 'power1.out',
        },
        0,
      )

      tl.to(logoRef.current, { height: 55 }, '<')
      tl.to(
        callRef.current,
        {
          opacity: 0,
          display: 'none',
          marginTop: -30,
          scale: 0.5,
          pointerEvents: 'none',
        },
        '<',
      )
    })
  })

  return (
    <>
      <Info title={`${t('free-delivery-from')}`} />

      <header
        ref={headerRef}
        className="bg-background sticky top-0 z-50 mx-auto mt-8 w-full max-w-[1240px] border-b-[1px] border-[#E4E4E4] px-5"
      >
        <div
          ref={menuRef}
          className="mx-auto grid h-full max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center justify-between py-3"
        >
          <div className="max-w-min">
            <nav className="hidden gap-3 lg:flex">
              {productLinks.slice(0, 4)?.map((link) => (
                <TransitionLink
                  key={link.slug}
                  href={`/${locale}/${link.slug}`}
                  className="pr-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105 hover:text-red-500"
                >
                  {link.name[locale]}
                </TransitionLink>
              ))}
            </nav>
            <HamburgerMenu
              productLinks={productLinks}
              hamburgerLinksOther={pageLinks[locale].slice(1, 5)}
            />
            <div ref={socialRef} className="mt-5 hidden justify-end lg:flex">
              <Socials size={33} />
            </div>
          </div>

          <TransitionLink
            ref={logoRef}
            href={`/${locale}`}
            className="text-foreground h-full self-start"
          >
            <svg
              width="86px"
              height="100px"
              className="h-full"
              role="img"
              aria-label={t('logo-slice-drys')}
            >
              <use href="/icons/sprite.svg#logo" />
            </svg>
          </TransitionLink>

          <div className="justify-self-end">
            <div className="flex justify-end lg:justify-between lg:gap-x-[clamp(20px,calc(20px+60*(100vw-1024px)/316),80px)]">
              <nav className="hidden gap-x-[10px] text-[20px] lg:flex">
                {pageLinks[locale].slice(1, 4)?.map((link: ILink) => (
                  <TransitionLink
                    key={link.id}
                    href={`/${locale}/${link.href}`}
                    className="p-3 text-[20px] transition-all duration-300 ease-in-out will-change-transform hover:scale-105 hover:text-red-500"
                  >
                    {link.name}
                  </TransitionLink>
                ))}
              </nav>

              <div
                ref={cartRef}
                className="flex items-center justify-center gap-x-4 lg:justify-between"
              >
                <LocaleChange className="hidden lg:block" />
                <ThemeToggle />
                <SmallCart />
              </div>
            </div>

            <div
              ref={callRef}
              className="flex origin-top-right justify-between"
            >
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
