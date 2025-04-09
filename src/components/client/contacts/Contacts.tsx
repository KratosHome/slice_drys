import { getTranslations } from 'next-intl/server'
import Socials from '@/components/ui/Socials'
import Image from 'next/image'
import ContactInfo from './ContactInfo'
import ContactForm from './ContactForm'
import UnderlineWave from '@/components/ui/underline-wave'

const Contacts = async () => {
  const t = await getTranslations('contacts')

  return (
    <section className="mx-auto flex flex-col items-center font-bold">
      <div className="mt-4 w-full flex-wrap items-center justify-between gap-[26px] md:flex md:items-start md:gap-[54px] lg:flex-nowrap lg:gap-[154px]">
        <div className="relative">
          <h1 className="font-rubik mb-[27px] w-full text-[clamp(48px,calc(64px+64*(100vw-768px)/672),96px)] font-normal md:w-fit">
            {t('title')}
          </h1>
          <p className="description relative mb-[17px] ml-auto w-fit fill-stone-950 pb-3 text-right text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),18px)] font-medium">
            {t('description')}
            <UnderlineWave />
          </p>
          <div className="mt-8 flex justify-end">
            <Socials size={40} />
          </div>
          <div className="relative top-[-30px] z-[-1] mb-8 block min-h-[143px] md:top-0 md:h-[390px]">
            <Image
              src="/images/Вag-Logo.webp"
              fill
              alt={t('hand_bag')}
              sizes="(max-width: 300px) 100vw, 50vw"
              className="bottom-0 max-h-[143px] max-w-[160px] md:max-h-[400px] md:max-w-[390px]"
            />
          </div>
        </div>
        <div className="ml-auto w-full text-base shadow-[16px_-16px_0px_#A90909] sm:max-w-[75%] md:mt-[99px] md:mr-8 md:text-xl lg:max-w-none">
          <ContactInfo block_title={t('information_title')} />
        </div>
      </div>
      <ContactForm
        button={t('button')}
        phone_field_description={t('phone_field_description')}
        placeholder={t('placeholder')}
        form_description={t('form_description')}
      />
    </section>
  )
}

export default Contacts
