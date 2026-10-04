import type { RefObject } from 'react'

import Image, { type StaticImageData } from 'next/image'

import meat from '../../../../../../public/slider/meat/meet.webp'
import orange from '../../../../../../public/slider/fruit/orange.webp'
import kiwi from '../../../../../../public/slider/fruit/kiwi.webp'
import grapefruit from '../../../../../../public/slider/fruit/grapefruit.webp'
import ginger from '../../../../../../public/slider/fruit/ginger.webp'
import pineapple from '../../../../../../public/slider/fruit/pineapple.webp'
import pear from '../../../../../../public/slider/fruit/pear.webp'
import mango from '../../../../../../public/slider/fruit/mango.webp'
import lemon from '../../../../../../public/slider/veggie/lemon.webp'
import cucumber from '../../../../../../public/slider/veggie/cucumber.webp'
import beet from '../../../../../../public/slider/veggie/beet.webp'
import tomato from '../../../../../../public/slider/veggie/tomato.webp'
import leftBottom from '../../../../../../public/slider/action/left-bottom.webp'
import leftTop from '../../../../../../public/slider/action/left-top.webp'
import rightTopText from '../../../../../../public/slider/action/right-top-text.webp'

const imageSources: Partial<Record<string, StaticImageData>> = {
  '/slider/meat/meet.webp': meat,
  '/slider/fruit/orange.webp': orange,
  '/slider/fruit/kiwi.webp': kiwi,
  '/slider/fruit/grapefruit.webp': grapefruit,
  '/slider/fruit/ginger.webp': ginger,
  '/slider/fruit/pineapple.webp': pineapple,
  '/slider/fruit/pear.webp': pear,
  '/slider/fruit/mango.webp': mango,
  '/slider/veggie/lemon.webp': lemon,
  '/slider/veggie/cucumber.webp': cucumber,
  '/slider/veggie/beet.webp': beet,
  '/slider/veggie/tomato.webp': tomato,
  '/slider/action/left-bottom.webp': leftBottom,
  '/slider/action/left-top.webp': leftTop,
  '/slider/action/right-top-text.webp': rightTopText,
}

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
          const image = imageSources[item.path]
          const sourceWidth = image?.width ?? item.width
          const sourceHeight = image?.height ?? item.height
          const displayWidth = Math.min(
            item.width,
            (item.height * sourceWidth) / sourceHeight,
          )
          const scaleDown = Boolean(image && displayWidth > sourceWidth)

          return (
            <Image
              key={index}
              src={image ?? item.path}
              alt=""
              quality={60}
              sizes={`${Math.ceil(Math.min(displayWidth, sourceWidth))}px`}
              unoptimized={scaleDown}
              className="absolute top-0 left-0 z-20 max-w-none"
              style={{
                opacity: 1,
                width: item.width,
                height: item.height,
                objectFit: scaleDown ? 'scale-down' : 'contain',
                transform: `translate3d(${item.position.desktop.x}px, ${item.position.desktop.y}px, 0) rotate(${item.rotate || 0}deg)`,
              }}
              width={sourceWidth}
              height={sourceHeight}
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
