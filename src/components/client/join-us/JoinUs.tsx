import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function Reviews() {
  const t = useTranslations('JoinUs')

  return (
    <div className="mt-60 flex flex-col justify-center bg-black py-7">
      <div className="mx-auto flex">
        <div className="align-center flex max-w-[1280]">
          <div className="flex w-[40%] -rotate-[17deg] flex-col">
            <div
              style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
              className="-translate-x-10 translate-y-3 text-center text-[48px] text-red"
            >
              {t('bite')}
            </div>
            <Image
              className="w-full"
              src={'/images/iPhone-15-Pro.png'}
              alt="iPhone image"
              width={520}
              height={440}
            />
          </div>
          <div className="ml-10 flex w-[60%] flex-col justify-center">
            <div
              style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
              className="text-start text-[80px] leading-tight text-white"
            >
              {t('join us')}
            </div>
            <div className="max-w-[600px] text-start text-[24px] text-white">
              {t('be first')}
            </div>
            <div className="ml-auto mt-8 flex h-[20%] w-[50%] translate-x-12 translate-y-2 -rotate-12 bg-red">
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
