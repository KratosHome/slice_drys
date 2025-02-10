'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { useLocale } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import FooterLinks from './footerLinks'

interface FooterP {
  footerLinks: ILink[]
  footerOtherLinks: ILink[]
}

const Footer: FC<FooterP> = ({ footerLinks, footerOtherLinks }) => {
  const local = useLocale()
  const footerLineStyles = "after:absolute after:w-full after:content-[''] after:bg-[url('/icons/underline-white.svg')] after:bg-center after:bg-[length:100%] after:bg-no-repeat after:h-[33px] after:top-[400px] md:after:top-[360px]"
  const isMobile = useIsMobile()

  return (
    <footer className={`relative w-full bg-black pb-[33px] pt-[60px] text-white ${footerLineStyles}`}>
      <div className="px-5 xl:px-56">
        <nav className="flex h-[216px] md:h-[162px] flex-col flex-wrap">
          <Link href={`/${local}`} className="absolute left-1/2 -translate-x-1/2">
            <Image
              src={'/icons/logo-white.svg'}
              alt="slice drus icon"
              className="h-[88px] w-[75px] lg:h-[183px] lg:w-[157px]"
              width={157}
              height={183}
            />
          </Link>
          {isMobile ? null : (
            <Link
              href={`/${local}`}
              className={`w-32 p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105 hover:text-red ${isMobile ? 'hidden' : 'block'}`}
            >
              Головна
            </Link>
          )}
          {isMobile ? <FooterLinks links={footerLinks} /> : null}
          <FooterLinks links={footerOtherLinks} />
        </nav>
        <div className="flex flex-col items-end mt-[10px]">
          <Link href={`/${local}/public-offert`} className='p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105 hover:text-red'>Публічна оферта</Link>
          <Link href={`/${local}/politics`} className='p-3 text-[20px] transition-all duration-300 ease-in-out hover:scale-105 hover:text-red'>Політика конфіденційності</Link>
        </div>
        <div className="mt-[44px] flex items-center justify-center gap-[7px]">
          <p className="rubik_doodle_shadow_b9e27325-module__Vkc6PW__className">приєднуйся до наших соцмереж</p>
          <Image
            src={'/icons/footer-arrow.svg'}
            alt="arrow down"
            width={11}
            height={24}
            className="rotate-90"
          />
        </div>
        <div className="flex mt-[18px] items-center justify-between ">
          <Link href={'tel:+380123456789'} className="flex justify-between items-center gap-[11px]">
            <Image
              src={'/icons/tel-white.svg'}
              alt="tel icon"
              width={24}
              height={24}
            />
            <p>+380123456789</p>
          </Link>
          <div className="flex justify-between items-center gap-5">
            <Link href={'#'}>
              <Image
                src={'/icons/facebook-white.svg'}
                alt="facebook icon"
                width={32}
                height={32}
              />
            </Link>
            <Link href={'#'}>
              <Image
                src={'/icons/instagram-white.svg'}
                alt="instagram icon"
                width={32}
                height={32}
              />
            </Link>
          </div>
          <p>&copy; 2024 SLICE&#38;DRY&apos;S</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
