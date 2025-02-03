import {
  FacebookIcon,
  InstagramIcon,
} from '@/components/client/contact/contact-icons'
import Image from 'next/image'
import Bag from '../../../../public/contact/shop-bag.png'

export default function ContactSocial() {
  return (
    <>
      <h2
        className={
          'clip-path-inset-50 absolute -m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0'
        }
      >
        Social network links
      </h2>
      <div className="mx-auto flex w-[375]">
        <div className={'flex w-24 items-center justify-center'}>
          <div className={'mr-4'}>
            <FacebookIcon rotation={0} width={40} height={40} />
          </div>
          <div>
            <InstagramIcon rotation={0} width={40} height={40} />
          </div>
        </div>
        <div className={'h-[143] w-[160]'}>
          <Image src={Bag} alt={'Shopping Bag'} className={'h-full w-full'} />
        </div>
      </div>
    </>
  )
}
