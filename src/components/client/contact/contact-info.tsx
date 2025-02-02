import {
  AddressIcon,
  ClockIcon,
  EmailIcon,
  PhoneIcon,
} from '@/components/client/contact/contact-icons'
import { useTranslations } from 'next-intl'

const ContactInfo = () => {
  const t = useTranslations('Contacts')
  return (
    <div className="mt-[50px] w-full">
      <div className="mx-auto w-[338px] bg-black px-3 py-6 text-left font-poppins text-base font-medium text-white drop-shadow-[16px_-16px_0px_#A90909]">
        <h2 className="font-rubik text-center text-4xl font-medium">
          {t('addressTitle')}
        </h2>
        <a className="flex pt-8" href={`mailto:${t('email')}`}>
          <span className="mr-3">
            <EmailIcon />
          </span>
          <span>{t('email')}</span>
        </a>
        <a className="flex pt-8" href={`tel:${t('phone')}`}>
          <span className="mr-3">
            <PhoneIcon />
          </span>
          <span>{t('phone')}</span>
        </a>
        <a
          className="flex pt-8"
          href={`https://www.google.com/maps?q=${t('location')}`}
          target={'_blank'}
        >
          <span className="mr-3">
            <AddressIcon />
          </span>
          <span>{t('location')}</span>
        </a>
        <p className="flex pt-8">
          <span className="mr-3">
            <ClockIcon />
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
