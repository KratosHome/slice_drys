import ContactsTitle from '@/components/client/contact/contacts-title'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/client/ui/breadcrumbs'
import React from 'react'

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
    <div className="mx-auto max-w-[1280px] p-5">
      <div className="pl-5 pt-7">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" localizationKey="Home"></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/${locale}/contacts`}
                localizationKey="Contacts"
              ></BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="">
        <ContactsTitle />
      </div>
    </div>
  )
}
