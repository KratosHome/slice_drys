import React from 'react'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { detectDevice } from '@/utils/deviceDetection'

import { cn } from '@/utils/cn'
import Socials from '../ui/Socials'

type Props = Readonly<{
  className?: string
}>
const JoinCommunity = async ({ className }: Props) => {
  const t = await getTranslations('promo-banner-join-community')
  const userAgent: string = (await headers()).get('user-agent') || ''
  const device: IDevice = detectDevice(userAgent)
  const { isMobile } = device

  return (
    <section
      className={cn(
        'mx-auto flex max-w-[1440px] flex-col overflow-x-clip bg-black px-[clamp(20px,calc(20px+80*(100vw-375px)/1065),30px)] pt-[30px] font-poppins text-white md:relative md:flex-row md:flex-row-reverse md:pb-[88px]',
        className,
      )}
    >
      <div className="banner-info relative w-full md:relative md:w-3/5 md:pt-[60px]">
        <div className="mb-[14px] font-rubik text-[26px] font-normal leading-[0.9] text-white md:mb-6 md:text-[clamp(32px,calc(32px+32*(100vw-375px)/1065),64px)]">
          {t('title')}
        </div>
        <div className="w-full max-w-[250px] text-wrap text-base md:block md:max-w-max md:text-xl">
          {t('description')}
        </div>
        <div className="social-wrapper absolute -left-[30px] top-[275px] flex -rotate-[12deg] flex-row-reverse items-center justify-start gap-[25px] bg-red-700 p-[15px_15px_15px_40px] md:-right-[110px] md:left-auto md:gap-[50px] md:p-[20px_20px_20px_40px] md:pr-[160px]">
          <Socials variant="light" size={isMobile ? 40 : 60} />
        </div>
        <Link
          href="https://www.instagram.com/slicedrys/#"
          target="_blank"
          className="group absolute -bottom-[70px] hidden w-full items-center gap-2 text-white md:mt-6 md:flex md:justify-self-end"
        >
          <Image
            src="/icons/instagram2.svg"
            alt={t('icon_instagram')}
            width={18}
            height={18}
            className="sm:h-[20px] sm:w-[20px]"
          />
          <span className="origin-left text-sm transition-transform duration-200 will-change-transform group-hover:scale-110 sm:text-base">
            @slicedrys
          </span>
        </Link>
      </div>
      <div className="banner-image relative min-h-[250px] w-full md:static md:w-2/5">
        <div className="banner-text absolute -right-[10px] -top-[90px] rotate-[11deg] font-rubik text-xl font-normal text-[#A90909] md:left-[50px] md:right-auto md:top-[69px] md:-rotate-[17deg] md:text-5xl">
          {t('text')}
        </div>
        <div className="relative aspect-[523/443] md:max-w-[523px]">
          <Image
            src={'/images/promo-banner-join-community.webp'}
            alt={t('title')}
            className="!-right-[40px] !-top-[60px] !bottom-auto !left-auto max-w-[206px] object-contain md:!right-0 md:!top-0 md:max-w-[503px]"
            fill
          />
        </div>
      </div>
    </section>
  )
}

export default JoinCommunity
