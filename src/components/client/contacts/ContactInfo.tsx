import { contacts } from '@/data/contacts'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

const ContactInfo = ({ block_title }: { block_title: string }) => {
  const locale = useLocale() as ILocale

  const t = useTranslations('contacts')

  return (
    <div className="info bg-foreground text-background p-6 md:py-10">
      <div className="block-title font-rubik mb-8 text-center text-4xl font-normal md:text-5xl">
        {block_title}
      </div>
      <div className="info-items text-base font-medium">
        <div className="info-item mail mb-8 flex items-center gap-x-3">
          <svg
            width="32px"
            height="32px"
            role="img"
            aria-label={t('mail_icon')}
          >
            <use href="/icons/sprite.svg#mail" />
          </svg>
          <Link href={`mailto:${contacts.mail}`}>{contacts.mail}</Link>
        </div>
        <div className="info-item phone mb-8 flex items-center gap-x-3">
          <svg
            width="32px"
            height="32px"
            role="img"
            aria-label={t('phone_icon')}
          >
            <use href="/icons/sprite.svg#phone" />
          </svg>
          <Link href={`tel:${contacts.phone}`}>{contacts.phone}</Link>
        </div>
        <div className="info-item location mb-8 flex items-center gap-x-3">
          <svg
            width="32px"
            height="32px"
            role="img"
            aria-label={t('home_icon')}
          >
            <use href="/icons/sprite.svg#home" />
          </svg>
          <span>{contacts.address[locale]}</span>
        </div>
        <div className="info-item time flex items-center gap-x-3">
          <svg
            width="32px"
            height="32px"
            role="img"
            aria-label={t('time_icon')}
          >
            <use href="/icons/sprite.svg#time" />
          </svg>
          <span>{contacts.time}</span>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo
