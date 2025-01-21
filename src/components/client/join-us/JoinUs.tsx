import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function Reviews() {
  const t = useTranslations('JoinUs')

  return (
    <div className="mt-60 flex flex-col justify-center bg-black py-7">
      <div className="mx-auto flex">
        <div className="align-start flex max-w-[1280] flex-col-reverse justify-end lg:flex-row">
          <div className="-mt-20 flex h-[50%] -rotate-[17deg] flex-col lg:mt-0 lg:h-full lg:w-[40%]">
            <div
              style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
              className="hidden translate-y-8 rotate-[30deg] text-center text-[48px] text-red lg:block lg:-translate-x-10 lg:rotate-0"
            >
              {t('bite')}
            </div>
            <div
              style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
              className="ml-auto translate-x-8 text-[48px] text-red lg:hidden"
            >
              {t('bite')}
            </div>
            <Image
              className="-mt-32 ml-auto mr-20 w-[50%] lg:mr-0 lg:mt-0 lg:w-full"
              src={'/images/iPhone-15-Pro.png'}
              alt={t('iPhone image')}
              width={520}
              height={440}
            />
          </div>
          <div className="ml-10 flex flex-col justify-center lg:w-[60%]">
            <div
              style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
              className="text-start text-[75px] leading-tight text-white"
            >
              {t('join us')}
            </div>
            <div className="max-w-[75%] text-start text-[24px] text-white lg:max-w-[600px]">
              {t('be first')}
            </div>
            <div className="ml-auto mt-8 flex w-[50%] -translate-x-[130%] translate-y-[60%] -rotate-12 justify-end bg-red md:h-32 lg:h-[20%] lg:translate-x-12 lg:translate-y-2 lg:justify-start">
              <Image
                src={'/icons/instagram-white.svg'}
                alt={t('instagram-white icon')}
                width={160}
                height={160}
                className="my-auto ml-5 h-[65%] w-[40%] cursor-pointer pl-10 md:mr-4 md:w-20 md:pl-0 lg:mr-0 lg:w-16"
              />
              <Image
                src={'/icons/facebook-white.svg'}
                alt={t('facebook-white icon')}
                width={160}
                height={160}
                className="mx-4 my-auto h-[65%] w-[40%] cursor-pointer md:mx-8 md:ml-5 md:w-20 lg:w-16"
              />
            </div>
          </div>
        </div>{' '}
      </div>
      <div className="mx-auto mt-auto flex h-0 items-center">
        <Image
          src={'/icons/instagram-white2.svg'}
          alt={t('instagram-white2 icon')}
          width={24}
          height={24}
          className="mr-3 h-[24px] cursor-pointer"
        />
        <div className="text-[20px] text-white">@slicedrys</div>
      </div>
    </div>
  )
}
