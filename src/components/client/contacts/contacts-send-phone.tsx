import { ArrowButtonIcon } from '@/components/client/contacts/contacts-icons'
import ContactsPhoneInput from '@/components/client/contacts/contacts-phone-input'
import { useTranslations } from 'next-intl'
import React from 'react'

function ContactsSendPhone() {
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
        <ContactsPhoneInput />
      </div>
    </>
  )
}

export default ContactsSendPhone
