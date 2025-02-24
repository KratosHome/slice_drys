import Bag from '@/assets/images/contact/shop-bag.png'
import {
  AddressIcon,
  ClockIcon,
  EmailIcon,
  FacebookIcon,
  InstagramIcon,
  PhoneIcon,
  UnderlineIcon,
} from '@/components/client/contacts/contacts-icons'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const ContactsInfo = () => {
  const t = useTranslations('Contacts')
  return (
    <>
      <div className={'mx-auto'}>
        <div className="w-[375] xl:w-[532]">
          <h1
            className={
              'mt-8 pl-[21px] font-rubikDouble text-5xl xl:w-[532] xl:text-9xl'
            }
          >
            {t('pageTitle')}
          </h1>
          <div
            className={
              'mt-[27px] pr-5 text-right font-poppins text-base font-medium xl:mt-4'
            }
          >
            <p>{t('contactDescription')}</p>
          </div>
          <div className="flex w-full pt-1">
            <div className="ml-auto pr-[15px]">
              <UnderlineIcon />
            </div>
          </div>
        </div>
      </div>
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
      <div className="mt-[50px] w-full">
        <div className="mx-auto w-[338px] bg-black px-3 py-6 text-left font-poppins text-base font-medium text-white drop-shadow-[16px_-16px_0px_#A90909]">
          <h2 className="font-rubik text-center text-4xl font-medium">
            {t('addressTitle')}
          </h2>
          <a className="flex pt-8" href={`mailto:${t('email')}`}>
            <span className="mr-3">
              <EmailIcon />
            </span>
            <span>{t('email')}</span>
          </a>
          <a className="flex pt-8" href={`tel:${t('phone')}`}>
            <span className="mr-3">
              <PhoneIcon />
            </span>
            <span>{t('phone')}</span>
          </a>
          <a
            className="flex pt-8"
            href={`https://www.google.com/maps?q=${t('location')}`}
            target={'_blank'}
          >
            <span className="mr-3">
              <AddressIcon />
            </span>
            <span>{t('location')}</span>
          </a>
          <p className="flex pt-8">
            <span className="mr-3">
              <ClockIcon />
            </span>
            <span>
              {t('openTime')} - {t('closeTime')}
            </span>
          </p>
        </div>
      </div>
    </>
  )
}

export default ContactsInfo
