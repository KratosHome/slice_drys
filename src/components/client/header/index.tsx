'use client'

import { pageLinks, routs } from '@/data/main/routs'

import HamburgerMenu from '@/components/client/header/hamburger-menu'
import LocaleChange from '@/components/client/header/locale-change'
import SmallCart from '@/components/client/header/small-cart'
import CallMe from '@/components/client/header/call-me'
import ThemeToggle from '@/components/client/theme-toggle'
import NumberCall from '@/components/client/number-call'
import Socials from '@/components/ui/socials'
import { TransitionLink } from '@/components/client/transition-link'

import { useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/utils/cn'

interface IHeaderProps {
  productLinks: IPublicCategoryLink[]
}

export default function Header({ productLinks }: IHeaderProps) {
  const t = useTranslations('main.header')

  const locale = useLocale() as ILocale

  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return
    const desktop = window.matchMedia('(min-width: 1024px)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame: number | undefined

    const update = () => {
      frame = undefined
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY) / (desktop.matches ? 100 : 200),
      )
      const eased = reducedMotion.matches ? 0 : 1 - (1 - progress) ** 2
      header.style.setProperty('--header-progress', String(eased))
      header.dataset.compact = String(eased === 1)
      header.dataset.scrolled = String(eased > 0)
    }
    const scheduleUpdate = () => {
      if (frame === undefined) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    desktop.addEventListener('change', scheduleUpdate)
    reducedMotion.addEventListener('change', scheduleUpdate)
    return () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      desktop.removeEventListener('change', scheduleUpdate)
      reducedMotion.removeEventListener('change', scheduleUpdate)
    }
  }, [])

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'site-header',
          'bg-background sticky top-0 z-50 mx-auto w-full max-w-[1240px] border-b-[1px] border-[#E4E4E4] px-5',
        )}
      >
        <div className="mx-auto grid h-full max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center justify-between py-3">
          <div className="max-w-min">
            <nav className="hidden gap-3 lg:flex">
              {productLinks.slice(0, 4)?.map((link) => (
                <TransitionLink
                  key={link.slug}
                  href={`/${locale}${routs.products}/${link.slug}`}
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
            <div className="site-header-social mt-5 hidden justify-end lg:flex">
              <Socials size={33} />
            </div>
          </div>
          <TransitionLink
            href={`/${locale}`}
            className="site-header-logo text-foreground h-full self-start"
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
              <div className="flex items-center justify-center gap-x-4 lg:justify-between">
                <LocaleChange className="hidden lg:block" />
                <ThemeToggle />
                <SmallCart />
              </div>
            </div>
            <div
              className={cn(
                'site-header-call',
                'flex origin-top-right justify-between',
              )}
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
