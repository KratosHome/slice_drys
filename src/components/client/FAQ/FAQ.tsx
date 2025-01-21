import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Collapse from './Collapse'

export default function AboutUs() {
  const t = useTranslations('FAQ')
  return (
    <div className="mx-auto mb-20 mb-28 mt-60 max-w-[1280px] items-center">
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
      <Collapse question={t('q1')} answer={t('a1')}></Collapse>
      <Collapse question={t('q2')} answer={t('a2')}></Collapse>
    </div>
  )
}
