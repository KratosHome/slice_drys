import ContactAdvert from '@/components/client/contact/contact-advert'
import ContactBreadcrumbs from '@/components/client/contact/contact-breadcrumbs'
import ContactInfo from '@/components/client/contact/contact-info'
import ContactSendPhone from '@/components/client/contact/contact-send-phone'
import ContactTitle from '@/components/client/contact/contact-title'

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

export default async function Contacts({ params }: Props) {
  const { locale } = await params

  return (
    <div className="mx-auto max-w-screen-xl">
      <section className="pl-5">
        <ContactBreadcrumbs locale={locale} />
      </section>
      <section>
        <ContactTitle />
      </section>
      <section>
        <ContactInfo />
      </section>
      <section>
        <ContactSendPhone />
      </section>
      <section>
        <ContactAdvert />
      </section>
    </div>
  )
}
