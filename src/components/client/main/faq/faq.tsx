import Item from '@/components/client/main/faq/item'
import { FC } from 'react'
import { getTranslations } from 'next-intl/server'

interface IFaq {
  data: Faq[]
}

const Faq: FC<IFaq> = async ({ data }) => {
  const t = await getTranslations('main.faq')

  return (
    <section
      aria-labelledby="FAQ"
      className="mx-auto mb-20 mt-60 max-w-[880px] items-center px-4"
    >
      <h1 className="font-rubik pr-0 text-center text-[38px] uppercase md:pr-20 md:text-[64px]">
        {t('all-about-dry-fruits')}
      </h1>
      <h2 className="slider-label relative mb-24 mt-5 grid max-w-max place-content-end">
        {t('even-what-did-not-ask')}
      </h2>
      {data.map((item: Faq) => (
        <Item
          key={item.title}
          question={item.title}
          answer={item.description}
        />
      ))}
    </section>
  )
}
export default Faq
