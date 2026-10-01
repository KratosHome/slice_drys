import Image from 'next/image'
const SliderWithThumbnails = ({ img, alt }: { img: string; alt: string }) => {
  return (
    <div className="flex w-full justify-center lg:w-1/2">
      <div className="relative aspect-12/9 w-full max-w-[344px] lg:aspect-auto">
        <Image
          className="object-contain"
          src={img}
          alt={alt}
          fill
          preload
          sizes="(max-width: 375px) calc(100vw - 32px), 344px"
          quality={70}
        />
      </div>
    </div>
  )
}

export default SliderWithThumbnails
