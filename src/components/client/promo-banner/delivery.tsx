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
        'relative mx-auto flex max-w-[1440px] flex-col overflow-x-clip bg-black px-[clamp(20px,calc(20px+80*(100vw-375px)/1065),100px)] pb-8 pt-[clamp(30px,calc(30px+40*(100vw-375px)/1065),70px)] font-poppins text-white md:flex-row',
        className,
      )}
    >
      <div className="w-full">
        <div className="max-w-min font-rubik text-[clamp(32px,calc(32px+32*(100vw-375px)/1065),64px)] leading-[0.9]">
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
        <div className="-ml-[clamp(40px,calc(40px+90*(100vw-375px)/1065),130px)] mt-[clamp(100px,calc(300px-200*(100vw-768px)/672),300px)] w-full max-w-[260px] rotate-[12deg] text-wrap bg-red-700 p-[20px_20px_20px_40px] text-base md:block md:max-w-max md:text-xl">
          {t('get_free_delivery')}
        </div>
        <Link
          href="https://www.instagram.com/slicedrys/#"
          target="_blank"
          className="group mt-11 flex items-center gap-2 text-white md:mt-6 md:justify-self-end"
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
      <div className="absolute -right-[clamp(50px,calc(50px+40*(100vw-375px)/1065),90px)] top-[clamp(-210px,calc(120px-330*(100vw-375px)/1065),120px)] aspect-[816/770] w-full max-w-[clamp(300px,calc(320px+330*(100vw-375px)/1065),650px)]">
        <Image
          src={'/images/cart-group-banner.png'}
          alt={t('icon_cart')}
          fill
          className="object-contain"
        />
      </div>
    </div>
  )
}

export default Delivery
