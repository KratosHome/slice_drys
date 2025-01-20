import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function Reviews() {
  const t = useTranslations('JoinUs')

  return (
    <div className="flex flex-col justify-center bg-black py-7">
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
              src={'/images/iPhone 15 Pro.png'}
              alt="pork image"
              width={520}
              height={440}
              objectFit={'contain'}
            />
          </div>
          <div className="flex w-[60%] flex-col justify-center">
            <div
              style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
              className="text-center text-[80px] leading-tight text-white"
            >
              {t('join us')}
            </div>
            <div className="text-center text-white">{t('be first')}</div>
            <div className="ml-auto mt-8 flex h-[20%] w-[50%] translate-x-12 translate-y-2 -rotate-12 bg-red">
              <Image
                src={'/icons/instagram-white.svg'}
                alt={t('instagram icon')}
                width={60}
                height={60}
                className="my-auto ml-5 h-[65%] cursor-pointer"
              />
              <Image
                src={'/icons/faceboo-white.svg'}
                alt={t('instagram icon')}
                width={60}
                height={60}
                className="my-auto ml-5 h-[65%] cursor-pointer"
              />
            </div>
          </div>
        </div>{' '}
      </div>
      <div className="mx-auto mt-auto flex h-0">
        <Image
          src={'/icons/instagram-white2.svg'}
          alt={t('instagram icon')}
          width={24}
          height={24}
          className="h-[24px] cursor-pointer pr-3"
        />
        <div className="text-white">@slicedrys</div>
      </div>
    </div>
  )
}
