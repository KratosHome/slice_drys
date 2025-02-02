import { useTranslations } from 'next-intl'
import React from 'react'

const images = {
  imageDesktop1x: 'contact/contact-desktop-1.png',
  imageDesktop2x: 'contact/contact-desktop-2.png',
  imageDesktop3x: 'contact/contact-desktop-3.png',
  imageMobile1x: 'contact/contact-mobile-1.png',
  imageMobile2x: 'contact/contact-mobile-2.png',
  imageMobile3x: 'contact/contact-mobile-3.png',
}

const ContactAdverb = () => {
  const t = useTranslations('Contacts')
  return (
    <div className="pt-[205]">
      <h2 className="clip-path-inset-50 absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0">
        {t('adverbTitle')}
      </h2>
      <picture>
        <source
          srcSet={`${images.imageDesktop1x} 1x ${images.imageDesktop2x} 2x ${images.imageDesktop3x} 3x`}
          type="image/png"
        />
        <source
          srcSet={`${images.imageMobile1x} 1x ${images.imageMobile2x} 2x ${images.imageMobile3x} 3x`}
          type="image/png"
          media="(min-width: 1280px)"
        />
        <img
          src={`${images.imageDesktop1x}`}
          alt={`${t('adverbTitle')}`}
          loading="lazy"
          decoding="async"
          width="100%"
          height="100%"
        />
      </picture>
    </div>
  )
}

export default ContactAdverb
