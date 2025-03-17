import imageDesktop1x from '@/assets/images/contact/contact-desktop-1x.png'
import imageMobile1x from '@/assets/images/contact/contact-mobile-1x.png'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

// const images = {
//   imageDesktop1x: '/public/contact/contact-desktop-1.png',
//   imageDesktop2x: '/contact/contact-desktop-2.png',
//   imageDesktop3x: '/contact/contact-desktop-3.png',
//   imageMobile1x: '/contact/contact-mobile-1.png',
//   imageMobile2x: '/contact/contact-mobile-2.png',
//   imageMobile3x: '/contact/contact-mobile-3.png',
// }

const ContactsAdvert = () => {
  const t = useTranslations('Contacts')

  return (
    <div className="mx-auto pt-[205] lg:pt-[229]">
      <div className={'h-[406] w-[375] lg:h-full xl:w-full'}>
        <h2 className="clip-path-inset-50 absolute m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0">
          {t('advertTitle')}
        </h2>
        <div className="max-w-screen-[1440] hidden lg:block">
          <Image src={imageDesktop1x} alt={t('advertTitle')} />
        </div>
        <div className="max-w-screen-[375] block lg:hidden">
          <Image src={imageMobile1x} alt={t('advertTitle')} />
        </div>
      </div>
    </div>
  )
}

export default ContactsAdvert
