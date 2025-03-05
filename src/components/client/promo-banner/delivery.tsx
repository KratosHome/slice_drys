import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

const Delivery = async () => {
  const t = await getTranslations('promo-banner')

  return (
    <div className="mb-[100px] mt-[200px] bg-black py-12 text-white lg:mt-[330px]">
      <div className="overlay-hidden mx-auto flex max-w-[1280px] flex-col justify-between px-5 md:flex-row">
        <div className="w-full px-0 md:px-[80px]">
          <div className="font-rubik text-[32px] leading-[0.9] md:mt-[70px] md:text-[44px] lg:text-[64px]">
            {t('free_delivery')}
          </div>
          <div className="mt-[27px] md:mt-[47px]">
            {t('when_ordering_from')}
            <span className="font-bold">1000 {t('uah')}</span>
          </div>
          <div className="-ml-[80px] mt-[60px] hidden max-w-max rotate-[10deg] bg-red-700 px-5 py-5 md:block">
            {t('get_free_delivery')}
          </div>
        </div>
        <div className="relative mt-[120px] flex w-full flex-col justify-center md:mt-0">
          <div className="relative mr-12 flex h-[250px] max-w-[75vw] rotate-[-10deg] items-center justify-center bg-red-700 md:h-[300px]">
            <div className="absolute -top-[15px] flex h-[220px] w-full rotate-[-5deg] items-center justify-center bg-white md:h-[270px]">
              <Image
                src={'/images/cart.png'}
                alt={t('icon_cart')}
                width={400}
                height={400}
                className="-mt-[120px] rotate-[5deg] object-contain md:-mt-[270px]"
              />
            </div>
          </div>

          <div className="-ml-[10px] mt-[50px] block max-w-max rotate-[5deg] bg-red-700 px-4 py-3 text-sm md:ml-[-25px] md:mt-[90px] md:hidden md:px-5 md:py-5 md:text-base">
            {t('get_free_delivery')}
          </div>

          <div className="mt-6 flex items-center justify-end gap-2 md:mt-10">
            <Link
              href="https://www.instagram.com/slicedrys/#"
              target="_blank"
              className="flex items-center gap-2 text-white transition-transform duration-200 hover:scale-110"
            >
              <Image
                src="/icons/instagram2.svg"
                alt={t('icon_instagram')}
                width={18}
                height={18}
                className="transition-transform duration-200 hover:scale-125 sm:h-[20px] sm:w-[20px]"
              />
              <span className="text-sm sm:text-base">@slicedrys</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Delivery
