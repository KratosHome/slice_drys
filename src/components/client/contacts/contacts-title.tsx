import { UnderlineIcon } from '@/components/client/contacts/contacts-icons'
import { useTranslations } from 'next-intl'

const ContactsTitle = () => {
  const t = useTranslations('Contacts')
  return (
    <div className={'mx-auto'}>
      <div className="w-[375] xl:w-[532]">
        <h1
          className={
            'mt-8 pl-[21px] font-rubik text-5xl xl:w-[532] xl:text-9xl'
          }
        >
          {t('pageTitle')}
        </h1>
        <div
          className={
            'mt-[27px] pr-5 text-right font-poppins text-base font-medium xl:mt-4'
          }
        >
          <p>{t('contactDescription')}</p>
        </div>
        <div className="flex w-full pt-1">
          <div className="ml-auto pr-[15px]">
            <UnderlineIcon />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactsTitle
