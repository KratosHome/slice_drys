import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { cn } from '@/utils/cn'

type Props = Readonly<{
  className?: string
}>
const Delivery = async ({ className }: Props) => {
  const t = await getTranslations('promo-banner')

  return (
    <div
      className={cn(
        'font-poppins bg-foreground text-background relative mx-auto flex max-w-[1440px] flex-col overflow-x-clip px-[clamp(20px,calc(20px+80*(100vw-375px)/1065),100px)] pt-[clamp(30px,calc(30px+40*(100vw-375px)/1065),70px)] pb-8 md:flex-row',
        className,
      )}
    >
      <div className="w-full">
        <div className="font-rubik max-w-min text-[clamp(32px,calc(32px+32*(100vw-375px)/1065),64px)] leading-[0.9]">
          {t('free_delivery')}
        </div>
        <div
          className="mt-3 md:mt-12"
          dangerouslySetInnerHTML={{
            __html: t.markup('when_ordering_from', {
              amount: '1000',
              bold: (chunk) => `<b>${chunk}</b>`,
            }),
          }}
        />
        <div className="mt-[clamp(100px,calc(300px-200*(100vw-768px)/672),300px)] -ml-[clamp(40px,calc(40px+90*(100vw-375px)/1065),130px)] w-full max-w-[260px] rotate-[12deg] bg-red-700 p-[20px_20px_20px_40px] text-base text-wrap md:block md:max-w-max md:text-xl">
          {t('get_free_delivery')}
        </div>
        <Link
          href="https://www.instagram.com/slicedrys/#"
          target="_blank"
          className="group text-background mt-11 flex items-center gap-2 md:mt-6 md:justify-self-end"
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
      <div className="absolute top-[clamp(-210px,calc(120px-330*(100vw-375px)/1065),120px)] -right-[clamp(50px,calc(50px+40*(100vw-375px)/1065),90px)] aspect-816/770 w-full max-w-[clamp(300px,calc(320px+330*(100vw-375px)/1065),650px)]">
        <Image
          src={'/images/cart-group-banner.webp'}
          alt={t('icon_cart')}
          fill
          className="object-contain"
        />
      </div>
    </div>
  )
}

export default Delivery
