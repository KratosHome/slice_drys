import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Review from './Review'

export default function Reviews() {
  const t = useTranslations('Reviews')

  return (
    <div>
      <div className="flex flex-col items-center">
        <div
          style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
          className="inline-block pr-60 text-[96px]"
        >
          {t('reviews')}
        </div>
        <div className="flex flex-col pl-60">
          <div className="inline-block flex-1 pb-3 text-[24px]">
            {' '}
            {t('say those')}
          </div>
          <div className="flex w-full">
            <div className="pl-10"></div>
            <Image
              className="flex-1"
              src={'/images/curved-line2.svg'}
              alt="pork image"
              width={388}
              height={13}
              objectFit={'contain'}
            />
          </div>
        </div>
      </div>
      <Review
        author="Валера Валерʼян"
        variant="grey"
        text="Сушені чіпси з м’яса – це просто фантастика! Легкий перекус для будь-якого дня. Залишився в захваті!"
      />
      <Review
        author="Валера Валерʼян"
        variant="black"
        text="Сушені чіпси з м’яса – це просто фантастика! Легкий перекус для будь-якого дня. Залишився в захваті!"
      />
      <Review
        author="Валера Валерʼян"
        variant="grey-white"
        text="Сушені чіпси з м’яса – це просто фантастика! Легкий перекус для будь-якого дня. Залишився в захваті!"
      />
    </div>
  )
}
