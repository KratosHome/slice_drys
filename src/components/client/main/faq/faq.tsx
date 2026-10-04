import FaqItems from './faq-items'
import UnderlineWave from '@/components/ui/underline-wave'

import { useTranslations } from 'next-intl'

interface IFaqProps {
  data: IFaq[]
}

export default function Faq({ data }: IFaqProps) {
  const t = useTranslations('main.faq')

  return (
    <section
      aria-labelledby="FAQ"
      className="section 1440:overflow-x-visible relative w-full max-w-[1280px] overflow-x-clip before:absolute before:top-[90px] before:-left-14 before:z-[-1] before:h-[208px] before:w-[149px] before:rotate-[73deg] before:bg-[url('/images/jerky.webp')] before:bg-no-repeat after:absolute after:top-[60%] after:-right-4 after:z-[-1] after:h-[208px] after:w-[149px] after:rotate-[-27deg] after:bg-[url('/images/jerky.webp')] after:bg-no-repeat lg:before:left-0"
    >
      <div className="mx-auto w-full max-w-[880px] items-center px-[20px] lg:px-0">
        <h2 id="FAQ" className="title-section pr-0 text-center md:pr-20">
          {t('all-about-dry-fruits')}
        </h2>
        <p className="relative mt-5 mb-7 ml-auto w-fit pb-4 text-[clamp(16px,calc(16px+8*(100vw-375px)/1065),24px)] lg:mb-[116px]">
          {t('even-what-did-not-ask')}
          <UnderlineWave />
        </p>
        <FaqItems data={data} />
      </div>
    </section>
  )
}
