import { getTranslations } from 'next-intl/server'
import Contacts from '@/components/client/contacts/Contacts'
import type { Metadata } from 'next'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/client/ui/breadcrumbs'

type PageProps = {
  params: Promise<{ locale: ILocale }>
  searchParams: Promise<{ page?: string }>
}

export default async function Contact({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations('Breadcrumbs')

  return (
    <div className="mx-auto max-w-[1280px] overflow-hidden p-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{t('Home')}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t('Contacts')}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mx-auto flex flex-col items-center font-bold">
        <Contacts />
      </div>
    </div>
  )
}
