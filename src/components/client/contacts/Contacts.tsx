import { getTranslations } from 'next-intl/server'
import Socials from '../ui/Socials'
import Image from 'next/image'
import ContactInfo from './ContactInfo'
import ContactForm from './ContactForm'

const Contacts = async () => {
  const t = await getTranslations('contacts')

  return (
    <section>
      <div className="mt-4 w-full flex-wrap items-center justify-between gap-[26px] md:flex lg:flex-nowrap lg:gap-[54px]">
        <div className="info-text relative">
          <h1 className="mb-[27px] w-full font-rubik text-[clamp(64px,calc(64px+64*(100vw-768px)/672),96px)] md:w-fit">
            {t('title')}
          </h1>
          <p className="description underline-wave relative mb-[17px] ml-auto w-fit pb-3 text-right font-poppins text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),18px)] font-medium">
            {t('description')}
          </p>
          <div className="mt-8 flex justify-end gap-x-4">
            <Socials variant="dark" size={40} />
          </div>
          <div className="relative top-[-30px] mb-8 block min-h-[143px]">
            <Image
              src="/images/Вag-Logo.webp"
              fill
              alt={'Hand bag'}
              sizes="(max-width: 300px) 100vw, 50vw"
              className="bottom-0 max-h-[143px] max-w-[160px]"
            />
          </div>
        </div>
        <div className="ml-auto w-full bg-black p-4 font-poppins text-base text-white shadow-[16px_-16px_0px_#A90909] sm:max-w-[75%] md:mr-8 md:text-xl lg:max-w-none">
          <ContactInfo block_title={t('information_title')} />
        </div>
      </div>
      <ContactForm
        button={t('button')}
        phone_field_description={t('phone_field_description')}
        placeholder={t('placeholder')}
      />
    </section>
  )
}

export default Contacts
