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
  const logoRef = useRef<HTMLAnchorElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const cullRef = useRef<HTMLDivElement>(null)
  const curtRef = useRef<HTMLDivElement>(null)

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
          height: '60px',
          marginTop: '0px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          duration: 0.5,
          minWidth: '100vw',
          ease: 'power1.out',
        },
        0,
      )

      tl.to(menuRef.current, { padding: '0px 20px' }, '<')

      tl.to(logoRef.current, { scale: 0.3, y: -30 }, '<')

      tl.to(socialRef.current, { opacity: 0, y: -30 }, '<')
      tl.to(cullRef.current, { opacity: 0, y: -30 }, '<')
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

      tl.to(
        curtRef.current,
        {
          marginTop: '10px',
        },
        0,
      )

      tl.to(logoRef.current, { x: -20 }, '<')

      tl.to(menuRef.current, { padding: '0px 10px' }, '<')

      tl.to(socialRef.current, { opacity: 0, y: -15 }, '<')
      tl.to(cullRef.current, { opacity: 0, display: 'none', y: -15 }, '<')
    })
  })

  return (
    <>
      <Info title={`${t('free-delivery-from')}`} />
      <header
        ref={headerRef}
        className="fixed left-1/2 top-0 z-50 mt-6 w-full max-w-[1240px] -translate-x-1/2 border-b-[1px] border-[#E4E4E4] transition-all lg:pb-6"
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
          <Link
            ref={logoRef}
            href={`/${local}`}
            className="ml-[55px] py-3 lg:py-0"
          >
            <Image
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
              <div ref={curtRef} className="flex items-center gap-x-4">
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
      </header>
    </>
  )
}

export default Header
