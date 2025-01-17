import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function AboutUs() {
  const t = useTranslations('AboutUs')

  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex items-center">
        <Image
          src={'/icons/arc-arrow-down.svg'}
          alt={t('facebook icon')}
          width={42}
          height={60}
          className="mr-10 pt-28"
        />
        <div
          className="w-[100%] text-[96px]"
          style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
        >
          {t('about us')}
        </div>
      </div>
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
          className="flex text-[36px]"
          style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
        >
          <div className="pl-10 pr-20">-</div>
          {t('is')}
        </div>
      </div>
      <div>{t('description')}</div>
    </div>
  )
}
