import { useTranslations } from 'next-intl'
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
    <div className={'mx-auto pt-[205] lg:max-w-screen-lg lg:pt-[229]'}>
      <div
        className={
          'h-[406] w-[375] bg-black lg:h-[590] lg:w-full lg:pt-[229px]'
        }
      >
        <h1
          className={'block font-rubik text-[28px] font-normal text-[#fbfbfb]'}
        >
          Приєднуйся до нашої спільноти !
        </h1>
        <p className={'block font-rubik text-xl font-normal text-[#A90909]'}>
          кусь!
        </p>
        <p
          className={'block font-poppins text-base font-medium text-[#fbfbfb]'}
        >
          Будь першим, хто дізнається про спеціальні пропозиції та отримує
          ексклюзивні знижки.
        </p>
      </div>
    </div>
    // <div className="mx-auto pt-[205] lg:pt-[229]">
    //   <div className={'h-[406] w-[375] lg:h-full xl:w-full'}>
    //     <h2 className="clip-path-inset-50 absolute m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0">
    //       {t('advertTitle')}
    //     </h2>
    //     <div className="max-w-screen-[1440] hidden lg:block">
    //       <Image src={imageDesktop1x} alt={t('advertTitle')} />
    //     </div>
    //     <div className="max-w-screen-[375] block lg:hidden">
    //       <Image src={imageMobile1x} alt={t('advertTitle')} />
    //     </div>
    //   </div>
    // </div>
  )
}

export default ContactsAdvert
