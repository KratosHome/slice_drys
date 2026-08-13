import type { RefObject } from 'react'

import Image from 'next/image'

interface ISubImagesProps {
  subImages: IHeroAnimationSubImage[]
  subImagesRefs: RefObject<HTMLImageElement[]>
}

export default function SubImages({
  subImages,
  subImagesRefs,
}: ISubImagesProps) {
  return (
    <div className="hero__animation absolute right-1/2 -bottom-2 z-20 hidden h-4/5 w-2/3 translate-x-1/2 items-center justify-center lg:flex">
      <div className="hero__animation-inner relative z-20 h-[100px] w-[100px]">
        {subImages.map((item, index) => {
          return (
            <Image
              key={index}
              src={item.path}
              alt=""
              quality={60}
              sizes={`${item.width}px`}
              className="absolute top-0 left-0 z-20 max-w-none"
              style={{
                opacity: 1,
                width: item.width,
                height: item.height,
                transform: `translate3d(${item.position.desktop.x}px, ${item.position.desktop.y}px, 0) rotate(${item.rotate || 0}deg)`,
              }}
              width={item.width}
              height={item.height}
              ref={(el) => {
                if (el) subImagesRefs.current[index] = el
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
