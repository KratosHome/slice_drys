import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Review from './Review'

const reviewsData = [
  {
    author: 'Валера Валерʼян',
    text: 'Сушені чіпси з м’яса – це просто фантастика! Легкий перекус для будь-якого дня. Залишився в захваті!',
  },
  {
    author: 'Валера Валерʼян',
    text: 'Сушені чіпси з м’яса – це просто фантастика! Легкий перекус для будь-якого дня. Залишився в захваті!',
  },
  {
    author: 'Валера Валерʼян',
    text: 'Сушені чіпси з м’яса – це просто фантастика! Легкий перекус для будь-якого дня. Залишився в захваті!',
  },
  {
    author: 'Валера Валерʼян',
    text: 'Сушені чіпси з м’яса – це просто фантастика! Легкий перекус для будь-якого дня. Залишився в захваті!',
  },
  {
    author: 'Валера Валерʼян',
    text: 'Сушені чіпси з м’яса – це просто фантастика! Легкий перекус для будь-якого дня. Залишився в захваті!',
  },
  {
    author: 'Валера Валерʼян',
    text: 'Сушені чіпси з м’яса – це просто фантастика! Легкий перекус для будь-якого дня. Залишився в захваті!',
  },
]
const variants = ['grey', 'black', 'grey-white']

export default function Reviews() {
  const t = useTranslations('Reviews')

  return (
    <div className="mt-40">
      <div className="mb-20 flex flex-col items-center">
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
      <div>
        {reviewsData.map((review, index) => (
          <Review
            key={index}
            author={review.author}
            text={review.text}
            variant={variants[index % variants.length]}
          />
        ))}
      </div>
    </div>
  )
}
