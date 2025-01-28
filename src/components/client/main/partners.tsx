import { FC } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

interface PartnersProps {
  data: {
    name: string
    logo: string
  }[]
}

const Partners: FC<PartnersProps> = async ({ data }) => {
  const t = await getTranslations('main')

  return (
    <section aria-labelledby="partners" className="px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold">{t('our-partners')}</h1>
        <div className="flex flex-wrap gap-[32px]">
          {data.map((partner) => (
            <div
              key={partner.name}
              className="relative flex h-[188px] w-[352px] items-center justify-center rounded-lg bg-[#14131B] p-6"
            >
              <Image
                src={partner.logo}
                alt={partner.name}
                fill={true}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Partners
