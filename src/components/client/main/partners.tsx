import { FC } from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

import { Marquee } from '@/components/ui/marque'
import { AspectRatio } from '@/components/ui/aspect-ratio'

interface PartnersProps {
  data: {
    name: string
    logo: string
  }[]
}

const Partners: FC<PartnersProps> = async ({ data }) => {
  const t = await getTranslations('main')

  return (
    <section aria-labelledby="partners" className="section px-5">
      <div className="mx-auto max-w-6xl">
        <h2
          id="partners"
          className="font-rubik text-center text-[clamp(48px,calc(48px+16*(100vw-375px)/1065),64px)] leading-[1.2] font-normal"
        >
          {t('our-partners')}
        </h2>

        <Marquee className="mt-8 md:mt-[60px]">
          {data?.map((partner) => (
            <div
              className="mr-[20px] block w-[150px] transition-all duration-300 will-change-transform hover:scale-105"
              key={partner.name}
            >
              <AspectRatio ratio={352 / 188}>
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill={true}
                  className="object-contain"
                />
              </AspectRatio>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export default Partners
