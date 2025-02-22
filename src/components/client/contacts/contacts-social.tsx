import {
  FacebookIcon,
  InstagramIcon,
} from '@/components/client/contacts/contacts-icons'
import Image from 'next/image'
import Bag from '../../../../public/contact/shop-bag.png'

export default function ContactsSocial() {
  return (
    <div className={'pt-[17]'}>
      <h2
        className={
          'clip-path-inset-50 absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0'
        }
      >
        Social network links
      </h2>
      <div className="mx-auto flex w-[375] flex-row-reverse items-start justify-between px-5">
        <div className={'flex w-24 items-center justify-center'}>
          <a
            className={'mr-4 cursor-pointer'}
            href="https://www.facebook.com/slicedrys/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon rotation={0} width={40} height={40} />
          </a>
          <a
            className={'cursor-pointer'}
            href="https://www.instagram.com/slicedrys/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon rotation={0} width={40} height={40} />
          </a>
        </div>
        <div className={'h-[143] w-[160] xl:h-full xl:w-full'}>
          <Image src={Bag} alt={'Shopping Bag'} className={'h-full w-full'} />
        </div>
      </div>
    </div>
  )
}
