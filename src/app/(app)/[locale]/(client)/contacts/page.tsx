import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/client/ui/breadcrumbs'
import React from 'react'

export type ContactPageProps = {
  params: Promise<{ locale: ILocale }>
  searchParams: Promise<{ page?: string }>
}

const translations = {
  en: {
    title: 'Contacts',
    description: 'This is the contact page.',
    keywords: ['blog', 'articles', 'news'],
  },
  uk: {
    title: 'Контакти',
    description: 'Це сторінка контактів.',
    keywords: ['блог', 'статті', 'новини'],
  },
}

export async function generateMetadata({ params }: ContactPageProps) {
  const { locale } = await params

  return translations[locale]
}

export default async function Contacts({ params }: ContactPageProps) {
  const { locale } = await params

  return (
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
  )
}
