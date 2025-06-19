'use client'

import { contacts } from '@/data/contacts'

import { Portal, Transition, TransitionChild } from '@headlessui/react'
import LocaleChange from '@/components/client/header/locale-change'
import Socials from '@/components/ui/socials'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { TransitionLink } from '@/components/client/transition-link'

import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { cn } from '@/utils/cn'

interface IHamburgerMenuProps {
  productLinks: ICategory[]
  hamburgerLinksOther: ILink[]
}

export default function HamburgerMenu({
  productLinks,
  hamburgerLinksOther,
}: IHamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  const locale = useLocale() as ILocale

  const t = useTranslations('main.hamburger-menu')

  const pathname: string = usePathname()

  const toggleMenu = (): void => setIsOpen(!isOpen)

  const containerClasses: string = `tham tham-e-squeeze tham-w-6 ${isOpen ? 'tham-active' : ''}`

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(document.documentElement.scrollTop > 10)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  return (
    <>
      <Button
        onClick={toggleMenu}
        variant="none"
        className="relative bg-transparent active:scale-110 lg:hidden"
        aria-label={t('open-main-menu')}
      >
        <div className={containerClasses}>
          <div className="tham-box">
            <div className="tham-inner bg-foreground" />
          </div>
        </div>
      </Button>
      <Transition show={isOpen} as={'div'} appear>
        <Portal>
          <TransitionChild>
            <div
              className="bg-foreground/30 fixed inset-0 z-500 hidden transition duration-300 data-closed:opacity-0 sm:block"
              onClick={() => setIsOpen(false)}
            />
          </TransitionChild>
          <TransitionChild>
            <div
              className={cn(
                'f-[100svh] bg-background fixed inset-y-0 z-500 w-full py-6 transition duration-500 sm:w-[50%] lg:hidden',
                'data-closed:-translate-x-full',
                'data-leave:duration-500 data-leave:ease-in-out',
                'data-leave:data-closed:-translate-x-full',
                isScrolled ? '' : 'top-[33px]',
              )}
            >
              <div className="flex flex-col">
                <div className="grid grid-cols-7 items-center justify-items-end px-5">
                  <button
                    onClick={toggleMenu}
                    className="justify-self-start text-[36px] leading-6 text-red-700"
                  >
                    &times;
                  </button>
                  <TransitionLink
                    href="/"
                    onClick={toggleMenu}
                    className="text-foreground col-span-3 col-start-3 self-center justify-self-center"
                  >
                    <svg width="39px" height="46px">
                      <use href="/icons/sprite.svg#logo" />
                    </svg>
                  </TransitionLink>
                  <div />
                  <LocaleChange />
                </div>
                <div className="mt-5 px-8 text-base">
                  <div className="py-2 font-semibold">{t('catalog')}</div>
                  {productLinks.slice(0, 4)?.map((link) => (
                    <TransitionLink
                      key={link.slug}
                      href={`/${locale}/${link.slug}`}
                      onClick={toggleMenu}
                      className={cn(
                        'block py-2 transition active:translate-x-2 active:text-red-700',
                        pathname.includes(link.slug) &&
                          'translate-x-2 text-red-700',
                      )}
                    >
                      {link.name[locale]}
                    </TransitionLink>
                  ))}
                  <Separator
                    orientation="horizontal"
                    className="bg-foreground my-[26px]"
                  />
                  {hamburgerLinksOther?.map((link) => (
                    <TransitionLink
                      key={link.id}
                      href={`/${locale}/${link.href}`}
                      onClick={toggleMenu}
                      className={cn(
                        'block py-2 transition active:translate-x-2 active:text-red-700',
                        pathname.includes(link.href) &&
                          'translate-x-2 text-red-700',
                      )}
                    >
                      {link.name}
                    </TransitionLink>
                  ))}
                </div>
                <div
                  className="flex items-center justify-center gap-x-5 pt-5"
                  onClick={toggleMenu}
                >
                  <Socials />
                </div>
                <div className="text-foreground mt-5 flex items-center justify-center gap-3">
                  <svg width="24px" height="24px">
                    <use href="/icons/sprite.svg#phone" />
                  </svg>
                  <TransitionLink
                    href={`tel:${contacts.phone}`}
                    onClick={toggleMenu}
                    className="font-medium active:text-red-700"
                  >
                    {contacts.phone}
                  </TransitionLink>
                </div>
              </div>
            </div>
          </TransitionChild>
        </Portal>
      </Transition>
    </>
  )
}
