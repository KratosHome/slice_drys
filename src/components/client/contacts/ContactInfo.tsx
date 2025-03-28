import { contacts } from '@/data/contacts'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

const ContactInfo = ({ block_title }: { block_title: string }) => {
  const locale = useLocale() as ILocale

  const t = useTranslations('contacts')

  return (
    <div className="info px-3 py-6 md:p-10">
      <div className="block-title font-white mb-8 text-center font-rubik text-4xl font-normal md:text-5xl">
        {block_title}
      </div>
      <div className="info-items font-poppins text-base font-medium">
        <div className="info-item mail mb-8 flex items-center gap-x-3">
          <Image
            src={'/icons/mail_white.svg'}
            alt={t('mail_icon')}
            width={32}
            height={32}
          />
          <Link href={`mailto:${contacts.mail}`} className="font-poppins">
            {contacts.mail}
          </Link>
        </div>
        <div className="info-item phone mb-8 flex items-center gap-x-3">
          <Image
            src={'/icons/phone_white.svg'}
            alt={t('phone_icon')}
            width={32}
            height={32}
          />
          <Link href={`tel:${contacts.phone}`} className="font-poppins">
            {contacts.phone}
          </Link>
        </div>
        <div className="info-item location mb-8 flex items-center gap-x-3">
          <Image
            src={'/icons/home_white.svg'}
            alt={t('home_icon')}
            width={32}
            height={32}
          />
          <span className="font-poppins">{contacts.address[locale]}</span>
        </div>
        <div className="info-item time flex items-center gap-x-3">
          <Image
            src={'/icons/time_white.svg'}
            alt={t('mail_icon')}
            width={32}
            height={32}
          />
          <span className="font-poppins">{contacts.time}</span>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
