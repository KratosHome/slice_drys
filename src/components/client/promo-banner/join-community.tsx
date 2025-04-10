import React from 'react'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { detectDevice } from '@/utils/device-detection'

import { cn } from '@/utils/cn'
import Socials from '@/components/ui/socials'

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
        'bg-foreground text-background mx-auto flex max-w-[1440px] flex-col overflow-x-clip px-[clamp(20px,calc(20px+80*(100vw-375px)/1065),30px)] pt-[30px] md:relative md:flex-row-reverse md:pb-[88px]',
        className,
      )}
    >
      <div className="banner-info relative w-full md:relative md:w-3/5 md:pt-[60px]">
        <div className="font-rubik text-background mb-[14px] text-[25px] leading-[0.9] font-normal md:mb-6 md:text-[42px] lg:text-[clamp(32px,calc(32px+32*(100vw-375px)/1065),64px)]">
          {t('title')}
        </div>
        <div className="w-full max-w-[250px] text-base text-wrap sm:max-w-full md:block md:max-w-max md:text-xl">
          {t('description')}
        </div>
        <div className="social-wrapper absolute top-[275px] -left-[30px] z-10 flex -rotate-[12deg] flex-row-reverse items-center justify-start gap-[25px] bg-red-700 p-[15px_15px_15px_40px] sm:-left-[40px] sm:p-[15px_15px_15px_60px] md:-right-[110px] md:left-auto md:gap-[50px] md:p-[20px_20px_20px_40px] md:pr-[160px]">
          <Socials
            className="text-background dark:text-foreground"
            size={isMobile ? 40 : 60}
          />
        </div>
        <Link
          href="https://www.instagram.com/slicedrys/#"
          target="_blank"
          className="group text-background absolute -bottom-[70px] hidden w-full items-center gap-2 md:mt-6 md:flex md:justify-self-end"
        >
          <svg
            width={18}
            height={18}
            role="img"
            aria-label={t('icon_instagram')}
            className="sm:h-[20px] sm:w-[20px]"
          >
            <use href="/icons/sprite.svg#instagram-square"></use>
          </svg>
          <span className="origin-left text-sm transition-transform duration-200 will-change-transform group-hover:scale-110 sm:text-base">
            @slicedrys
          </span>
        </Link>
      </div>
      <div className="banner-image relative min-h-[250px] w-full md:static md:w-2/5 md:pt-[140px] lg:pt-[50px] xl:pt-0">
        <div className="banner-text font-rubik absolute -top-[90px] -right-[10px] rotate-[11deg] text-xl font-normal text-[#A90909] md:top-[69px] md:right-auto md:left-[50px] md:-rotate-[17deg] md:text-5xl">
          {t('text')}
        </div>
        <div className="relative aspect-523/443 md:max-w-[523px]">
          <Image
            src={'/images/promo-banner-join-community.webp'}
            alt={t('title')}
            className="-top-[60px]! -right-[40px]! bottom-auto! left-auto! max-w-[150px] object-contain sm:max-w-[70%] md:top-0! md:right-0! md:max-w-[503px]"
            fill
          />
        </div>
      </div>
    </section>
  )
}

export default JoinCommunity
