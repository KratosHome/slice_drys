import { FC } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { Marquee } from '../ui/marque'
import { AspectRatio } from '../ui/aspect-ratio'

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
        <h2 className="text-center font-rubik text-[clamp(48px,calc(48px+16*(100vw-375px)/1065),64px)] font-normal leading-[1.2]">
          {t('our-partners')}
        </h2>

        <Marquee className="mt-8 md:mt-[60px]">
          {data.map((partner) => (
            <Link
              className="mr-[20px] block w-[150px] transition-all duration-300 will-change-transform hover:scale-105"
              href={`https://letmegooglethat.com/?q=${partner.name}%20супермаркет`}
              target="_blank"
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
            </Link>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export default Partners
