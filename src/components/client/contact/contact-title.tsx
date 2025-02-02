import { UnderlineIcon } from '@/components/client/contact/contact-icons'
import { useTranslations } from 'next-intl'

const ContactTitle = () => {
  const t = useTranslations('Contacts')
  return (
    <div className="w-full">
      <h1 className="mt-8 pl-[21px] font-rubikDouble text-5xl lg:text-9xl">
        {t('pageTitle')}
      </h1>
      <div className="pr-5 pt-[27px] text-right font-poppins text-base font-medium">
        <p>{t('contactDescription')}</p>
      </div>
      <div className="flex w-full pt-1">
        <div className="ml-auto pr-[15px]">
          <UnderlineIcon />
        </div>
      </div>
    </div>
  )
}

export default ContactTitle
