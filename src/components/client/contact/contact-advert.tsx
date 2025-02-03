import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

const images = {
  imageDesktop1x: '/public/contact/contact-desktop-1.png',
  imageDesktop2x: '/contact/contact-desktop-2.png',
  imageDesktop3x: '/contact/contact-desktop-3.png',
  imageMobile1x: '/contact/contact-mobile-1.png',
  imageMobile2x: '/contact/contact-mobile-2.png',
  imageMobile3x: '/contact/contact-mobile-3.png',
}

const ContactAdvert = () => {
  const t = useTranslations('Contacts')

  return (
    <div className="pt-[205]">
      <h2 className="clip-path-inset-50 absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0">
        {t('advertTitle')}
      </h2>

      <div className="hidden lg:block">
        <Image
          src={images.imageDesktop1x}
          alt={t('advertTitle')}
          width={1200}
          height={800}
        />
      </div>
      <div className="block lg:hidden">
        <Image
          src={images.imageMobile1x}
          alt={t('advertTitle')}
          width={400}
          height={300}
        />
      </div>
    </div>
  )
}

export default ContactAdvert
