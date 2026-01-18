import type { RefObject } from 'react'

import Image from 'next/image'

import { cn } from '@/utils/cn'

interface ISubImagesProps {
  subImages: IHeroAnimationSubImage[]
  subImagesRefs: RefObject<HTMLImageElement[]>
  device: IDevice
}

export default function SubImages({
  subImages,
  subImagesRefs,
  device,
}: ISubImagesProps) {
  const { isMobile, isTablet, isDesktop } = device

  return (
    <div className="hero__animation absolute right-1/2 -bottom-2 z-20 flex h-4/5 w-2/3 translate-x-1/2 items-center justify-center">
      <div className="hero__animation-inner relative z-20 h-[100px] w-[100px]">
        {subImages.map((item, index) => {
          const top: number = isMobile
            ? isTablet
              ? item.position?.tablet?.y
              : item.position?.mobile?.y
            : item.position?.desktop?.y
          const left: number = isMobile
            ? isTablet
              ? item.position?.tablet?.x
              : item.position?.mobile?.x
            : item.position?.desktop?.x

          return (
            <Image
              key={index}
              src={item.path}
              alt="Slider sub image"
              priority
              loading="eager"
              quality={60}
              role="img"
              className={cn(
                `absolute top-1/2 left-1/2 z-20 h-auto w-auto -translate-x-1/2 -translate-y-1/2 transform opacity-0`,
                isMobile ? `opacity-1` : '',
                isDesktop ? `w-[${item.width}px]` : '',
              )}
              style={{
                top: isDesktop ? `0` : `${top}px`,
                left: isDesktop ? `0` : `${left}px`,
                transform: `rotate(${item.rotate || 0}deg)`,
                display: isMobile && item.isMobileDiz ? 'none' : 'block',
              }}
              width={isDesktop ? item.width : item.width / 2}
              height={isDesktop ? item.height : item.height / 2}
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
