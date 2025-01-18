import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function AboutUs() {
  const t = useTranslations('AboutUs')

  return (
    <div>
      <div className="mx-auto flex w-full max-w-[1280] flex-col items-center p-5">
        <div></div>
        <div className="flex items-center pb-20">
          <Image
            src={'/icons/arc-arrow-down.svg'}
            alt={t('facebook icon')}
            width={42}
            height={60}
            className="mr-16 pt-28"
          />
          <div
            className="w-[100%] text-[96px]"
            style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
          >
            {t('about us')}
          </div>
        </div>
        <div className="flex w-[100%] flex-row items-center">
          <div className="justify-center bg-black px-6 py-12">
            <Image
              src={'/icons/logo-white.svg'}
              alt={t('facebook icon')}
              width={120}
              height={140}
            />
          </div>
          <div
            className="flex w-[15%] items-center justify-between text-[36px]"
            style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
          >
            <div className="pl-10">-</div>
            <div>{t('is')}</div>
          </div>
        </div>

        <div className="mt-20 max-w-[100%]">
          <div className="float-right -mt-80 pl-10">
            <Image
              src={'/images/pork.jpeg'}
              alt="pork image"
              width={550}
              height={675}
              objectFit={'contain'}
            />
          </div>
          <p className="text-[20px]">{t('description')}</p>
        </div>
      </div>
    </div>
  )
}
