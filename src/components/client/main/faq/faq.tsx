import { FC } from 'react'
import { getTranslations } from 'next-intl/server'

import Item from '@/components/client/main/faq/item'

interface IFaq {
  data: Faq[]
}

const Faq: FC<IFaq> = async ({ data }) => {
  const t = await getTranslations('main.faq')

  return (
    <section
      aria-labelledby="FAQ"
      className="section 1440:overflow-x-visible relative w-full max-w-[1440px] overflow-x-clip before:absolute before:-left-14 before:top-[90px] before:z-[-1] before:h-[208px] before:w-[149px] before:rotate-[73deg] before:bg-[url('/images/jerky.png')] before:bg-no-repeat after:absolute after:-right-4 after:top-[60%] after:z-[-1] after:h-[208px] after:w-[149px] after:rotate-[-27deg] after:bg-[url('/images/jerky.png')] after:bg-no-repeat lg:before:left-0"
    >
      <div className="mx-auto w-full max-w-[880px] items-center px-[20px] lg:px-0">
        <h2 className="title-section pr-0 text-center md:pr-20">
          {t('all-about-dry-fruits')}
        </h2>
        <p className="slider-label relative mb-8 mt-5 grid place-content-end text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] lg:mb-[116px]">
          {t('even-what-did-not-ask')}
        </p>
        <div className="mt-[clamp(32px,calc(32px+84*(100vw-375px)/1065),116px)]">
          {data.map((item: Faq) => (
            <Item
              key={item.title}
              question={item.title}
              answer={item.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
export default Faq
