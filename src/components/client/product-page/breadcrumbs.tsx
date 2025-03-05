import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/client/ui/breadcrumbs'
import React, { FC } from 'react'
import { getTranslations } from 'next-intl/server'

interface BreadcrumbsProps {
  category: string
  product: string
  categoryLink: string
  locale: string
}

export const Breadcrumbs: FC<BreadcrumbsProps> = async ({
  category,
  product,
  categoryLink,
  locale,
}) => {
  const t = await getTranslations('product-list')

  return (
    <Breadcrumb className="my-2">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">{t('home')}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/${locale}/${categoryLink}`}>
            {category}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{product}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
