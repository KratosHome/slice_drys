import Bag from '@/assets/images/contact/shop-bag.png'
import {
  AddressIcon,
  ClockIcon,
  EmailIcon,
  UnderlineIcon,
} from '@/components/client/contacts/contacts-icons'
import Socials from '@/components/client/ui/Socials'
import { PhoneIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const ContactsInfo = () => {
  const t = useTranslations('Contacts')
  return (
    <>
      <div className={'mx-auto'}>
        <h1
          className={
            'mt-8 block pl-[21px] text-left font-rubik text-5xl lg:text-[96px]'
          }
        >
          {t('pageTitle')}
        </h1>
        <p
          className={
            'mt-[27px] pr-5 text-right font-poppins text-base font-medium lg:mt-4'
          }
        >
          {t('contactDescription')}
        </p>
        <div className={'flex justify-end pr-[15px] pt-1'}>
          <UnderlineIcon />
        </div>
      </div>
      <div className={'pt-[17]'}>
        <h2
          className={
            'clip-path-inset-50 absolute m-px h-px w-px overflow-hidden whitespace-nowrap border-0 p-0'
          }
        >
          Social network links
        </h2>
        <div
          className={
            'mx-auto flex w-[375] flex-row-reverse items-start justify-between px-5'
          }
        >
          <div className="flex justify-end gap-x-4">
            <Socials variant="dark" />
          </div>
          <div className={'h-[143] w-[160] pt-2.5 lg:h-full lg:w-full'}>
            <Image src={Bag} alt={'Shopping Bag'} className={'h-full w-full'} />
          </div>
        </div>
      </div>
      <div className={'mt-[50px] w-full'}>
        <div
          className={
            'mx-auto w-[338px] bg-black px-3 py-6 text-left font-poppins text-base font-medium text-white drop-shadow-[16px_-16px_0px_#A90909]'
          }
        >
          <h2
            className={
              'font-rubik-doodle-shadow text-center text-4xl font-medium'
            }
          >
            {t('addressTitle')}
          </h2>

          {/* Email address*/}

          <div
            className={
              'align-center group mt-8 flex cursor-pointer items-end gap-x-3 pl-3 font-poppins text-base font-medium text-[#FBFBFB]'
            }
          >
            <div
              className={
                'shrink-0 transform duration-300 [filter:invert(0)] group-hover:skew-x-[-5deg] group-hover:scale-110'
              }
            >
              <EmailIcon />
            </div>
            <a
              className={
                'block duration-300 group-hover:skew-x-[-10deg] group-hover:text-red-500'
              }
              href={`mailto:${t('email')}`}
            >
              {t('email')}
            </a>
          </div>

          {/* Phone number */}

          <div
            className={
              'align-center group mt-8 flex cursor-pointer items-end gap-x-3 pl-3 font-poppins text-base font-medium text-[#FBFBFB]'
            }
          >
            <div
              className={
                'shrink-0 transform duration-300 [filter:invert(0)] group-hover:skew-x-[-5deg] group-hover:scale-110'
              }
            >
              <PhoneIcon />
            </div>
            <a
              className={
                'block duration-300 group-hover:skew-x-[-10deg] group-hover:text-red-500'
              }
              href={`tel:${t('phone')}`}
            >
              {t('phone')}
            </a>
          </div>

          {/* Location*/}

          <div
            className={
              'align-center group mt-8 flex cursor-pointer items-end gap-x-3 pl-3 font-poppins text-base font-medium text-[#FBFBFB]'
            }
          >
            <div
              className={
                'shrink-0 transform duration-300 [filter:invert(0)] group-hover:skew-x-[-5deg] group-hover:scale-110'
              }
            >
              <AddressIcon />
            </div>
            <a
              className={
                'block duration-300 group-hover:skew-x-[-10deg] group-hover:text-red-500'
              }
              href={`https://www.google.com/maps?q=${t('location')}`}
              target={'_blank'}
            >
              {t('location')}
            </a>
          </div>

          {/* Working Time*/}

          <div
            className={
              'align-center group mt-8 flex items-end gap-x-3 pl-3 font-poppins text-base font-medium text-[#FBFBFB]'
            }
          >
            <div className={''}>
              <ClockIcon />
            </div>
            <p>
              {t('openTime')} - {t('closeTime')}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactsInfo
