'use client'
import './help.scss'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import Button from '@/components/client/ui/button'
import { getBlockSettings } from '@/server/blocks/block-actions.server'
import { ILocaleProps } from '@/types/ILocale'

const Help: FC<ILocaleProps> = ({ locale }) => {
  const [data, setData] = useState<{
    title: string
    subTitle: string
    text: string
    button: string
    link: string
    images: { src: string; alt: string; link: string }[]
  } | null>(null)

  useEffect(() => {
    async function fetchData() {
      const settings = await getBlockSettings('help')

      if (settings) {
        setData({ ...settings[locale] })
      }
    }

    fetchData()
  }, [locale])

  const handleImageClick = (link: string) => {
    window.open(link, '_blank')
  }

  if (!data) {
    return
  }

  return (
    <section aria-labelledby="help" className="mt-60 bg-black py-8">
      <div className="mx-auto max-w-[1280px] px-5">
        <h1 className="mb-6 text-2xl font-bold text-white">{data?.title?.value}</h1>
        <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
          <div className="w-full md:w-1/2">
            <Splide
              options={{
                type: 'loop',
                perPage: 1,
                pagination: true,
                arrows: false,
                autoplay: true,
                interval: 3000,
              }}
              className="custom-splide mt-6"
            >
              {data?.images?.value.map((path, index) => (
                <SplideSlide key={index}>
                  <div className="relative h-[290px] w-full overflow-hidden rounded-lg md:h-[390px]">
                    <Image src={path} alt={data?.title?.value} fill={true} />
                  </div>
                </SplideSlide>
              ))}
            </Splide>
          </div>
          <div className="flex h-[230px] w-full flex-col justify-between rounded-lg bg-[#14131B] p-6 text-white md:h-[390px] md:w-1/2 md:py-[77px]">
            <div>
              <h2 className="mb-4 text-xl font-semibold">
                {data?.subTitle?.value}
              </h2>
              <p className="mb-6 pr-5 md:text-sm">{data?.text?.value}</p>
            </div>
            <Button
              variant="yellow"
              className="md:max-w-[260px]"
              onClick={() => handleImageClick(data?.link?.value ?? '')}
            >
              {data?.button?.value}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Help
