import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function AboutUs() {
  const t = useTranslations('AboutUs')

  return (
    <div>
      <div className="mx-auto flex w-full max-w-[1280] flex-col items-center">
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

        <div className="flex w-[100%]">
          <div className="flex w-[60%] flex-col">
            <div className="flex">
              <div className="justify-center bg-black px-6 py-12">
                <Image
                  src={'/icons/logo-white.svg'}
                  alt={t('facebook icon')}
                  width={120}
                  height={140}
                />
              </div>

              <div
                className="flex items-center text-[36px]"
                style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
              >
                <div className="pl-10 pr-20">-</div>
                {t('is')}
              </div>
            </div>
            <div className="pr-10 pt-20 text-[24px]"> {t('description')}</div>
          </div>
          <Image
            className="w-[40%] object-cover"
            src={'/images/pork.jpeg'}
            alt="pork image"
            width={550}
            height={675}
          />
        </div>
      </div>
    </div>
  )
}
