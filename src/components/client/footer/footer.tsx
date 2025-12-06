'use client'

import { pageLinks } from '@/data/main/nav-links'

import Socials from '@/components/ui/socials'
import NumberCall from '@/components/client/number-call'
import { TransitionLink } from '@/components/client/transition-link'

import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/utils/cn'

const linkStyle =
  'md:hover:text-red-500 px-[10px] md:py-[10px] text-[clamp(16px,calc(16px+4*(100vw-375px)/1065),20px)] transition-all duration-300 ease-in-out md:hover:translate-x-3 active:translate-x-3 active:text-red-500'

interface IFooterProps {
  productLinks: ICategory[]
}

export default function Footer({ productLinks }: IFooterProps) {
  const locale = useLocale() as ILocale
  const t = useTranslations('main.footer')

  const year = new Date().getFullYear()

  return (
    <footer
      className="bg-foreground text-background dark:bg-background dark:text-foreground"
      aria-labelledby="footer"
    >
      <nav className="border-background dark:border-foreground relative mx-auto grid w-full max-w-[1440px] grid-cols-3 px-[clamp(20px,calc(20px+206*(100vw-768px)/672),226px)] pt-[40px] pb-[26px] md:pt-[60px] md:pb-[33px] dark:border-t dark:border-dashed">
        <ul className="hidden flex-col gap-[10px] justify-self-start md:flex">
          {pageLinks[locale].slice(0, 2)?.map((link: ILink) => (
            <li key={link.id} className={cn(linkStyle, 'pl-0')}>
              <TransitionLink href={`/${locale}/${link.href}`}>
                {link.name}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-[19px] justify-self-start md:hidden">
          {productLinks.map((link) => (
            <li key={link.slug} className={linkStyle}>
              <TransitionLink key={link.slug} href={`/${locale}/${link.slug}`}>
                {link.name[locale]}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <div className="max-w-24 self-stretch justify-self-center">
          <TransitionLink href={`/${locale}`}>
            <svg
              className="h-[100px] w-[6rem] px-5 md:px-0"
              role="img"
              aria-label={t('logo-slice-drys')}
            >
              <use href="/icons/sprite.svg#logo" />
            </svg>
          </TransitionLink>
        </div>
        <ul className="flex flex-col gap-[19px] justify-self-end text-end md:hidden">
          {pageLinks[locale].slice(1, 2)?.map((link: ILink) => (
            <li
              key={link.id}
              className={cn(
                linkStyle,
                'active:-translate-x-3 md:hover:-translate-x-3',
              )}
            >
              <TransitionLink href={`/${locale}/${link.href}`}>
                {link.name}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <ul className="g-[10px] hidden flex-col justify-self-end text-end md:flex">
          {pageLinks[locale].slice(2, 5)?.map((link: ILink) => (
            <li
              key={link.id}
              className={cn(
                linkStyle,
                'pr-0 active:-translate-x-3 md:hover:-translate-x-3',
              )}
            >
              <TransitionLink href={`/${locale}/${link.href}`}>
                {link.name}
              </TransitionLink>
            </li>
          ))}
        </ul>
        <div className="order-3 col-start-1 col-end-4 mt-[24px] flex justify-center gap-[20px] self-end md:order-none md:col-start-1 md:col-end-2 md:mt-[10px] md:mb-[35px] md:justify-start">
          <svg width={49} height={50} role="img" aria-label={t('logo-visa')}>
            <use href="/icons/sprite.svg#visa" />
          </svg>
          <svg
            width={46}
            height={47}
            role="img"
            aria-label={t('logo-mastercard')}
          >
            <use href="/icons/sprite.svg#mastercard" />
          </svg>
        </div>
        <ul className="col-start-1 col-end-4 mt-[57px] mb-[35px] flex flex-col gap-[14px] text-end md:col-span-2 md:col-start-2 md:mt-[10px] md:gap-[10px]">
          <li>
            <TransitionLink
              href={`/${locale}/public-offer`}
              className={cn(
                linkStyle,
                'inline-block first-letter:capitalize active:-translate-x-3 md:pr-[5px] md:hover:-translate-x-3',
              )}
            >
              {t('public-offer')}
            </TransitionLink>
          </li>
          <li>
            <TransitionLink
              href={`/${locale}/privacy-policy`}
              className={cn(
                linkStyle,
                'inline-block first-letter:capitalize active:-translate-x-3 md:pr-[5px] md:hover:-translate-x-3',
              )}
            >
              {t('privacy-policy')}
            </TransitionLink>
          </li>
        </ul>
        <div className="col-start-1 col-end-4 h-[clamp(28px,calc(28px+5*(100vw-375px)/1065),33px)]">
          <svg className="absolute left-0 h-[clamp(28px,calc(28px+5*(100vw-375px)/1065),33px)] w-full">
            <use href="/icons/sprite.svg#underline-white" />
          </svg>
        </div>
        <div className="font-rubik order-1 col-start-1 col-end-4 flex justify-center gap-3 text-center text-[clamp(16px,calc(16px+4*(100vw-375px)/1065),20px)] md:order-none">
          <span>{t('CTA-socials')}</span>
          <span className="inline-block rotate-90">&gt;</span>
        </div>
        <NumberCall
          className="order-2 col-start-1 col-end-2 mt-[24px] justify-self-start text-nowrap md:order-none md:mt-[18px]"
          variant="light"
        />
        <div className="order-1 col-start-1 col-end-4 mt-[24px] flex justify-center gap-[20px] text-center md:order-none md:col-start-2 md:col-end-3 md:mt-[18px]">
          <Socials className="text-background dark:text-foreground" size={33} />
        </div>
        <div className="order-2 col-start-3 col-end-4 mt-[24px] justify-self-end text-end text-nowrap uppercase md:order-none md:mt-[18px]">
          &copy; {year ?? '—'} SLICE&DRY’S
        </div>
      </nav>
    </footer>
  )
}
