'use client'
import { ArrowButtonIcon } from '@/components/client/contact/contact-icons'

export default function ContactToTop() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mx-auto flex max-w-[1280px] justify-end">
      <div className={'cursor-pointer'} onClick={scrollToTop}>
        <ArrowButtonIcon rotation={180} width={40} height={48} />
      </div>
    </div>
  )
}
