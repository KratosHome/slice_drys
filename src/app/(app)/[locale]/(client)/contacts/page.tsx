import ContactAdvert from '@/components/client/contact/contact-advert'
import ContactBreadcrumbs from '@/components/client/contact/contact-breadcrumbs'
import ContactInfo from '@/components/client/contact/contact-info'
import ContactSendPhone from '@/components/client/contact/contact-send-phone'
import ContactSocial from '@/components/client/contact/contact-social'
import ContactTitle from '@/components/client/contact/contact-title'
import ContactToTop from '@/components/client/contact/contact-to-top'

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
      <div className="pl-5 xl:m-auto xl:pt-10 xl:font-poppins xl:text-xl xl:font-normal">
        <ContactBreadcrumbs />
      </div>
      <div className="justify-between xl:flex">
        <div className={'xl:mr-[156px]'}>
          <div>
            <ContactTitle />
          </div>
          <div>
            <ContactSocial />
          </div>
        </div>
        <div>
          <ContactInfo />
        </div>
      </div>
      <div>
        <ContactSendPhone />
      </div>
      <div>
        <ContactAdvert />
      </div>
      <div
        className={'flex items-center justify-center pt-[185] xl:justify-end'}
      >
        <div>
          <ContactToTop />
        </div>
      </div>
    </div>
  )
}
