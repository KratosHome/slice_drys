import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

import NumberCall from '../header/number-call/number-call'
import Socials from '@/components/ui/Socials'

import { pageLinks } from '@/data/main/nav-links'
import { cn } from '@/utils/cn'
import Image from 'next/image'
import { FC } from 'react'

const linkStyle =
  'md:hover:text-red-500 px-[10px] md:py-[10px] text-[clamp(16px,calc(16px+4*(100vw-375px)/1065),20px)] transition-all duration-300 ease-in-out md:hover:translate-x-3 active:translate-x-3 active:text-red-500'

interface FooterP {
  productLinks: ICategory[]
}

const Footer: FC<FooterP> = ({ productLinks }) => {
  const locale = useLocale() as ILocale
  const t = useTranslations('main.footer')
  return (
    <footer className="bg-black text-white">
      <nav className="relative mx-auto grid w-full max-w-[1440px] grid-cols-3 px-[clamp(20px,calc(20px+206*(100vw-768px)/672),226px)] pt-[40px] pb-[26px] md:pt-[60px] md:pb-[33px]">
        <ul className="hidden flex-col gap-[10px] justify-self-start md:flex">
          {pageLinks[locale].slice(0, 2)?.map((link: ILink) => (
            <li key={link.id} className={cn(linkStyle, 'pl-0')}>
              <Link href={`/${locale}/${link.href}`}>{link.name}</Link>
            </li>
          ))}
        </ul>
        <ul className="flex flex-col gap-[19px] justify-self-start md:hidden">
          {productLinks.map((link) => (
            <li key={link.slug} className={linkStyle}>
              <Link key={link.slug} href={`/${locale}/${link.slug}`}>
                {link.name[locale]}
              </Link>
            </li>
          ))}
        </ul>

        <div className="self-stretch justify-self-center">
          <Link href={`/${locale}`} className="block h-full">
            <Image
              src={'/icons/logo-white.svg'}
              alt="LOGO"
              className="w-auto! px-5 transition-transform duration-300 ease-in-out md:h-full! md:px-0"
              width={86}
              height={100}
            />
          </Link>
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
              <Link href={`/${locale}/${link.href}`}>{link.name}</Link>
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
              <Link href={`/${locale}/${link.href}`}>{link.name}</Link>
            </li>
          ))}
        </ul>

        <div className="order-3 col-start-1 col-end-4 mt-[24px] flex justify-center gap-[20px] self-end md:order-none md:col-start-1 md:col-end-2 md:mt-[10px] md:mb-[35px] md:justify-start">
          <Image
            src={'/icons/visa.svg'}
            alt="logo-visa"
            width={49}
            height={50}
          />
          <Image
            src={'/icons/mastercard.svg'}
            alt="logo-mastercard"
            width={46}
            height={47}
          />
        </div>
        <ul className="col-start-1 col-end-4 mt-[57px] mb-[35px] flex flex-col gap-[14px] text-end md:col-span-2 md:col-start-2 md:mt-[10px] md:gap-[10px]">
          <li>
            <Link
              href={`/${locale}/public-offer`}
              className={cn(
                linkStyle,
                'inline-block first-letter:capitalize active:-translate-x-3 md:pr-[5px] md:hover:-translate-x-3',
              )}
            >
              {t('public-offer')}
            </Link>
          </li>
          <li>
            <Link
              href={`/${locale}/privacy-policy`}
              className={cn(
                linkStyle,
                'inline-block first-letter:capitalize active:-translate-x-3 md:pr-[5px] md:hover:-translate-x-3',
              )}
            >
              {t('privacy-policy')}
            </Link>
          </li>
        </ul>
        {/* Curved line in the middle of the footer */}
        <div className="col-start-1 col-end-4 h-[clamp(28px,calc(28px+5*(100vw-375px)/1065),33px)] after:absolute after:left-0 after:h-[clamp(28px,calc(28px+5*(100vw-375px)/1065),33px)] after:w-full after:bg-[url('/icons/underline-white.svg')]"></div>
        <div className="font-rubik order-1 col-start-1 col-end-4 flex justify-center gap-3 text-center text-[clamp(16px,calc(16px+4*(100vw-375px)/1065),20px)] md:order-none">
          <span>{t('CTA-socials')}</span>
          <span className="inline-block rotate-90">&gt;</span>
        </div>
        <NumberCall
          className="order-2 col-start-1 col-end-2 mt-[24px] justify-self-start text-nowrap md:order-none md:mt-[18px]"
          variant="light"
        />
        <div className="order-1 col-start-1 col-end-4 mt-[24px] flex justify-center gap-[20px] text-center md:order-none md:col-start-2 md:col-end-3 md:mt-[18px]">
          <Socials variant="light" size={33} />
        </div>
        <div className="order-2 col-start-3 col-end-4 mt-[24px] justify-self-end text-end text-nowrap uppercase md:order-none md:mt-[18px]">
          &copy; {new Date().getFullYear()} SLICE&DRY’S
        </div>
      </nav>
    </footer>
  )
}
export default Footer
