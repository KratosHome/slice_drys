import { Clock3, House, Mail, Phone } from 'lucide-react'
import { useTranslations } from 'next-intl'

const ContactInfo = () => {
  const t = useTranslations('Contacts')
  return (
    <div className="mt-[50px] w-full">
      <div className="mx-auto w-[338px] bg-black px-3 py-6 text-left font-poppins text-base font-medium text-white drop-shadow-[16px_-16px_0px_#A90909]">
        <p className="font-rubik text-center text-4xl font-medium">
          {t('title')}
        </p>
        <p className="flex pt-8">
          <span className="mr-3">
            <Mail />
          </span>
          <span>{t('email')}</span>
        </p>
        <p className="flex pt-8">
          <span className="mr-3">
            <Phone />
          </span>
          <span>{t('phone')}</span>
        </p>
        <p className="flex pt-8">
          <span className="mr-3">
            <House />
          </span>
          <span>{t('address')}</span>
        </p>
        <p className="flex pt-8">
          <span className="mr-3">
            <Clock3 />
          </span>
          <span>
            {t('openTime')} - {t('closeTime')}
          </span>
        </p>
      </div>
    </div>
  )
}

export default ContactInfo
