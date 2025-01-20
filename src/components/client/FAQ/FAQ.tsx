import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function AboutUs() {
  const t = useTranslations('FAQ')
  return (
    <div className="mx-auto mb-20 mt-60 max-w-[1280px] items-center">
      <div
        className="pr-20 text-center text-[64px]"
        style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
      >
        {t('title')}
      </div>
      <div className="mb-20 flex">
        <div className="flex-1"></div>
        <div className="flex flex-1 flex-col items-center">
          <div className="inline-block text-[24]">{t('subtitle')} </div>
          <Image
            className="pl-5"
            src={'/images/curved-line2.svg'}
            alt="pork image"
            width={258}
            height={13}
          />
        </div>
      </div>

      <div className="mx-auto mb-5 flex max-w-[800px] items-center border border-black p-2 pl-4 text-[24px]">
        {t('q1')}{' '}
        <div className="ml-auto pr-3">
          <div
            style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
            className="ml-auto mt-3 rotate-90 text-[28px]"
          >
            {'>'}
          </div>
        </div>
      </div>

      <div className="mx-auto mb-5 flex max-w-[800px] items-center border border-black p-2 pl-4 text-[24px]">
        {t('q1')}{' '}
        <div className="ml-auto pr-3">
          <div
            style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
            className="ml-auto mt-3 rotate-90 text-[28px]"
          >
            {'>'}
          </div>
        </div>
      </div>
    </div>
  )
}
