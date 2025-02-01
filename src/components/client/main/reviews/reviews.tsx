import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import ReviewsItem from '@/components/client/main/reviews/reviews-item'

const reviewsData = {
  en: [
    {
      author: 'Valera Valeryan',
      text: 'Dried meat chips are just fantastic! A light snack for any day. I was thrilled!',
    },
    {
      author: 'Valera Valeryan',
      text: 'Dried meat chips are just fantastic! A light snack for any day. I was thrilled!',
    },
    {
      author: 'Valera Valeryan',
      text: 'Dried meat chips are just fantastic! A light snack for any day. I was thrilled!',
    },
    {
      author: 'Valera Valeryan',
      text: 'Dried meat chips are just fantastic! A light snack for any day. I was thrilled!',
    },
    {
      author: 'Valera Valeryan',
      text: 'Dried meat chips are just fantastic! A light snack for any day. I was thrilled!',
    },
    {
      author: 'Valera Valeryan',
      text: 'Dried meat chips are just fantastic! A light snack for any day. I was thrilled!',
    },
  ],
  uk: [
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
  ],
}
const variants = ['grey', 'black', 'grey-white']

export default function Reviews() {
  const t = useTranslations('main.reviews')

  const locale: ILocale = useLocale() as ILocale
  return (
    <div className="mt-40">
      <div className="mx-auto mb-20 flex max-w-[720px] flex-col">
        <div
          style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
          className="ml-auto mr-0 text-[96px] md:ml-0 md:mr-auto"
        >
          {t('reviews')}
        </div>
        <div className="ml-auto flex flex-col">
          <div className="inline-block pb-3 text-[24px]"> {t('say-those')}</div>
          <div className="ml-auto flex w-[90%]">
            <Image
              src={'/images/curved-line2.svg'}
              alt="pork image"
              width={500}
              height={13}
            />
          </div>
        </div>
      </div>
      <div className="p-16">
        {reviewsData[locale].map((review, index) => (
          <ReviewsItem
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
