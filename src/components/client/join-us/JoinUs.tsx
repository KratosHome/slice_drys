import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function Reviews() {
  const t = useTranslations('JoinUs')

  return (
    <div className="mt-60 flex flex-col justify-center bg-black py-7">
      <div className="mx-auto flex">
        <div className="align-start flex max-w-[1280] flex-col-reverse justify-end lg:flex-row">
          <div className="flex h-[50%] -rotate-[17deg] flex-col lg:h-full lg:w-[40%]">
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
              alt="iPhone image"
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
            <div className="ml-auto mt-8 flex h-[20%] w-[50%] -translate-x-[150%] translate-y-2 -rotate-12 flex-row-reverse bg-red lg:translate-x-12 lg:flex-row">
              <Image
                src={'/icons/instagram-white.svg'}
                alt="instagram icon"
                width={60}
                height={60}
                className="my-auto ml-5 h-[65%] cursor-pointer"
              />
              <Image
                src={'/icons/facebook-white.svg'}
                alt="facebook icon"
                width={60}
                height={60}
                className="my-auto ml-5 h-[65%] cursor-pointer"
              />
            </div>
          </div>
        </div>{' '}
      </div>
      <div className="mx-auto mt-auto flex h-0 items-center">
        <Image
          src={'/icons/instagram-white2.svg'}
          alt="instagram icon"
          width={24}
          height={24}
          className="mr-3 h-[24px] cursor-pointer"
        />
        <div className="text-[20px] text-white">@slicedrys</div>
      </div>
    </div>
  )
}
