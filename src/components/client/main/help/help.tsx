'use client'
import './help.scss'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import Image from 'next/image'
import { FC } from 'react'
import Button from '@/components/client/ui/button'

interface HelpProps {
  data: {
    title: string
    subTitle: string
    text: string
    button: string
    link: string
    img: {
      src: string
      alt: string
      link: string
    }[]
  }
}

const Help: FC<HelpProps> = ({ data }) => {
  const handleImageClick = (link: string) => {
    window.open(link, '_blank')
  }

  return (
    <section aria-labelledby="help" className="bg-black py-8">
      <div className="mx-auto max-w-[1280px] px-5">
        <h1 className="mb-6 text-2xl font-bold text-white">{data.title}</h1>
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
              {data.img.map((slide, index) => (
                <SplideSlide key={index}>
                  <div className="relative h-[390px] w-full overflow-hidden rounded-lg">
                    <Image src={slide.src} alt={slide.alt} fill={true} />
                  </div>
                </SplideSlide>
              ))}
            </Splide>
          </div>
          <div className="flex h-[390px] w-full flex-col justify-between rounded-lg bg-[#14131B] p-6 py-[77px] text-white md:w-1/2">
            <div>
              <h2 className="mb-4 text-xl font-semibold">{data.subTitle}</h2>
              <p className="mb-6 pr-5 md:text-sm">{data.text}</p>
            </div>
            <Button
              variant="yellow"
              className="max-w-[260px]"
              onClick={() => handleImageClick(data.link)}
            >
              {data.button}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Help
