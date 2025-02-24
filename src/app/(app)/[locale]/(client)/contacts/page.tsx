import ContactsAdvert from '@/components/client/contacts/contacts-advert'
import ContactsBreadcrumbs from '@/components/client/contacts/contacts-breadcrumbs'
import ContactsInfo from '@/components/client/contacts/contacts-info'
import ContactsSendPhone from '@/components/client/contacts/contacts-send-phone'
import ContactsSocial from '@/components/client/contacts/contacts-social'
import ContactsTitle from '@/components/client/contacts/contacts-title'
import ToTheTop from '@/components/client/ui/to-the-top'

type Props = {
  params: Promise<{ locale: ILocale }>
}

const translations = {
  en: {
    title: 'Contacts',
    description: 'This is the contact page.',
    keywords: ['contacts', 'address', 'phone'],
  },
  uk: {
    title: 'Контакти',
    description: 'Це сторінка контактів.',
    keywords: ['контакти', 'адреса', 'телефон'],
  },
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return translations[locale]
}

export default async function Contacts() {
  return (
    <div className="mx-auto max-w-screen-xl">
      <ContactsBreadcrumbs />
      <ContactsInfo />
      <ContactsSendPhone />
      <ContactsAdvert />
      <ToTheTop />
    </div>
  )
}
