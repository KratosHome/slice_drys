import { ArrowButtonIcon } from '@/components/client/contact/contact-icons'
import ContactPhoneInput from '@/components/client/contact/contact-phone-input'
import { useTranslations } from 'next-intl'
import React from 'react'

function ContactSendPhone() {
  const t = useTranslations('Contacts')

  return (
    <>
      <div className="pt-[110px]">
        <h2 className="font-rubik text-center text-2xl font-normal">
          {t('sendDescription')}
        </h2>
      </div>
      <div className="flex items-center justify-center pt-[43px]">
        <ArrowButtonIcon rotation={0} width={50} height={60} />
      </div>
      <div>
        <ContactPhoneInput />
      </div>
    </>
  )
}

export default ContactSendPhone
