import Image from 'next/image'
const SliderWithThumbnails = ({ img, alt }: { img: string; alt: string }) => {
  return (
    <div className="flex w-full justify-center lg:w-[44%] lg:pt-10">
      <div className="relative aspect-12/9 w-full max-w-[344px] lg:aspect-square lg:max-w-[400px]">
        <Image
          className="object-contain"
          src={img}
          alt={alt}
          fill
          preload
          sizes="(max-width: 375px) calc(100vw - 32px), (max-width: 1023px) 344px, 400px"
          quality={70}
        />
      </div>
    </div>
  )
}

export default SliderWithThumbnails
