'use client'
import { ArrowButtonIcon } from '@/components/client/contacts/contacts-icons'

export default function ContactsToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex w-[375] max-w-[1280px] justify-end pr-[20] xl:max-w-7xl">
      <div className={'block cursor-pointer xl:hidden'} onClick={scrollToTop}>
        <ArrowButtonIcon rotation={180} width={40} height={48} />
      </div>
      <div className={'hidden cursor-pointer xl:block'} onClick={scrollToTop}>
        <ArrowButtonIcon rotation={180} width={50} height={60} />
      </div>
    </div>
  )
}
