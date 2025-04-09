import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Portal, Transition, TransitionChild } from '@headlessui/react'
import { useState, Children, Fragment, useEffect } from 'react'
import LocaleChange from '@/components/client/header/locale-change/locale-change'
import Socials from '@/components/ui/socials'
import { Separator } from '@/components/ui/separator'

import { contacts } from '@/data/contacts'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'

interface IHamburgerMenuProps {
  productLinks: ICategory[]
  hamburgerLinksOther: ILink[]
}

export default function HamburgerMenu({
  productLinks,
  hamburgerLinksOther,
}: IHamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const locale = useLocale() as ILocale

  const t = useTranslations('main.burger-menu')
  const closeMenu = () => setIsOpen(!isOpen)
  const pathname = usePathname()

  const containerClasses = `tham tham-e-squeeze tham-w-6 ${isOpen ? 'tham-active' : ''}`

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(document.documentElement.scrollTop > 10)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="none"
        className="relative bg-transparent active:scale-110 lg:hidden"
        aria-label={t('open_main_menu')}
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
              className="bg-foreground fixed inset-0 z-500 hidden transition duration-300 data-closed:opacity-0 sm:block"
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
                    onClick={closeMenu}
                    className="justify-self-start text-[36px] leading-6 text-red-700"
                  >
                    &times;
                  </button>

                  <Link
                    href="/"
                    onClick={closeMenu}
                    className="text-foreground col-span-3 col-start-3 self-center justify-self-center"
                  >
                    <svg width="39px" height="46px">
                      <use href="/icons/sprite.svg#logo" />
                    </svg>
                  </Link>
                  <div />
                  <LocaleChange />
                </div>

                <div className="mt-5 px-8 text-base">
                  <div className="py-2 font-semibold">{t('catalog')}</div>
                  {productLinks.slice(0, 4)?.map((link) => (
                    <Link
                      key={link.slug}
                      href={`/${locale}/${link.slug}`}
                      onClick={closeMenu}
                      className={cn(
                        'block py-2 transition active:translate-x-2 active:text-red-700',
                        pathname.includes(link.slug) &&
                          'translate-x-2 text-red-700',
                      )}
                    >
                      {link.name[locale]}
                    </Link>
                  ))}

                  <Separator
                    orientation="horizontal"
                    className="bg-foreground my-[26px]"
                  />
                  {hamburgerLinksOther?.map((link) => (
                    <Link
                      key={link.id}
                      href={`/${locale}/${link.href}`}
                      onClick={closeMenu}
                      className={cn(
                        'block py-2 transition active:translate-x-2 active:text-red-700',
                        pathname.includes(link.href) &&
                          'translate-x-2 text-red-700',
                      )}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                <div
                  className="flex items-center justify-center gap-x-5 pt-5"
                  onClick={closeMenu}
                >
                  {Children.toArray(<Socials />).map((child, index) => (
                    <Fragment key={index}>{child}</Fragment>
                  ))}
                </div>

                <div className="text-foreground mt-5 flex items-center justify-center gap-3">
                  <svg width="24px" height="24px">
                    <use href="/icons/sprite.svg#phone" />
                  </svg>
                  <Link
                    href={`tel:${contacts.phone}`}
                    onClick={closeMenu}
                    className="font-medium active:text-red-700"
                  >
                    {contacts.phone}
                  </Link>
                </div>
              </div>
            </div>
          </TransitionChild>
        </Portal>
      </Transition>
    </>
  )
}
