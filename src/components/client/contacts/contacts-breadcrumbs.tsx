import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/client/ui/breadcrumbs'
import React from 'react'

export default function ContactsBreadcrumbs() {
  return (
    <div className="ml-auto mr-auto pl-5 lg:ml-auto lg:mr-0 lg:pt-10 lg:font-poppins lg:text-xl lg:font-normal">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" localizationKey="Home" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage localizationKey="Contacts" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
