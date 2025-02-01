import ContactBreadcrumbs from '@/components/client/contact/contact-breadcrumbs'
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
      <div className="pl-5">
        <ContactBreadcrumbs locale={locale} />
      </div>
      <div className="mt-8">
        <ContactTitle />
      </div>
    </div>
  )
}
