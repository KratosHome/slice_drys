'use client'

import { contacts } from '@/data/contacts'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react'
import LocaleChange from '@/components/client/header/locale-change'
import Socials from '@/components/ui/socials'
import { Separator } from '@/components/ui/separator'
import { TransitionLink } from '@/components/client/transition-link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Fragment, useEffect, useRef, useState } from 'react'
import { cn } from '@/utils/cn'

interface MenuPanelProps {
  id: string
  isOpen: boolean
  onClose: () => void
  productLinks: IPublicCategoryLink[]
  hamburgerLinksOther: ILink[]
}

export default function MenuPanel({
  id,
  isOpen,
  onClose,
  productLinks,
  hamburgerLinksOther,
}: MenuPanelProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [isScrolled, setIsScrolled] = useState(
    () => document.documentElement.scrollTop > 10,
  )
  const locale = useLocale() as ILocale
  const t = useTranslations('main.hamburger-menu')
  const pathname = usePathname()

  useEffect(() => {
    if (!isOpen) return
    const handleScroll = () =>
      setIsScrolled(document.documentElement.scrollTop > 10)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isOpen])

  return (
    <Transition show={isOpen} as={Fragment} appear>
      <Dialog
        onClose={onClose}
        initialFocus={closeButtonRef}
        className="fixed inset-0 z-500"
      >
        <TransitionChild>
          <div
            className="bg-foreground/30 fixed inset-0 z-500 hidden transition duration-300 data-closed:opacity-0 sm:block"
            aria-hidden="true"
          />
        </TransitionChild>
        <TransitionChild>
          <DialogPanel
            id={id}
            className={cn(
              'f-[100svh] bg-background fixed inset-y-0 z-500 w-full py-6 transition duration-500 sm:w-[50%] lg:hidden',
              'data-closed:-translate-x-full',
              'data-leave:duration-500 data-leave:ease-in-out',
              'data-leave:data-closed:-translate-x-full',
              isScrolled ? '' : 'top-[33px]',
            )}
          >
            <DialogTitle className="sr-only">{t('menu-title')}</DialogTitle>
            <div className="flex flex-col">
              <div className="grid grid-cols-7 items-center justify-items-end px-5">
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label={t('close-main-menu')}
                  className="justify-self-start text-[36px] leading-6 text-red-700"
                >
                  &times;
                </button>
                <TransitionLink
                  href={`/${locale}`}
                  onClick={onClose}
                  className="text-foreground col-span-3 col-start-3 self-center justify-self-center"
                  aria-label={t('logo')}
                >
                  <svg width="39px" height="46px">
                    <use href="/icons/sprite.svg#logo" />
                  </svg>
                </TransitionLink>
                <div />
                <LocaleChange onNavigate={onClose} />
              </div>
              <div className="mt-5 px-8 text-base">
                <div className="py-2 font-semibold">{t('catalog')}</div>
                {productLinks.slice(0, 4)?.map((link) => (
                  <TransitionLink
                    key={link.slug}
                    href={`/${locale}/products/${link.slug}`}
                    onClick={onClose}
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
                    onClick={onClose}
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
                onClick={onClose}
              >
                <Socials />
              </div>
              <div className="text-foreground mt-5 flex items-center justify-center gap-3">
                <svg width="24px" height="24px">
                  <use href="/icons/sprite.svg#phone" />
                </svg>
                <TransitionLink
                  href={`tel:${contacts.phone}`}
                  onClick={onClose}
                  className="font-medium active:text-red-700"
                >
                  {contacts.phone}
                </TransitionLink>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </Dialog>
    </Transition>
  )
}
