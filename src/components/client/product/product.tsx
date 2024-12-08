import React, { useState, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { IProductCard } from '@/types/product'
import Button from '@/components/client/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ProductProps = {
  product: IProductCard
}

const Product = ({ product }: ProductProps) => {
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0)

  const selectedPrice = product.price[selectedWeightIndex]
  const selectedNewPrice = product.newPrice?.[selectedWeightIndex] ?? 0

  const containerRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5
    const shadowOffsetX = x * 5
    const shadowOffsetY = y * 5
    gsap.to(containerRef.current, {
      rotationY: -25 * x,
      rotationX: 25 * y,
      transformPerspective: 800,
      duration: 0.3,
      boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px 10px 6px rgba(169, 9, 9, 0.7)`,
    })

    gsap.to(imgRef.current, {
      rotationY: -25 * x,
      rotationX: 25 * y,
      transformPerspective: 1000,
    })
  }
  const handleMouseEnter = () => {
    gsap.to(imgRef.current, {
      scale: 1.05,
      translateY: 10,
      zIndex: 12,
      ease: 'power1.inOut',
    })
    gsap.to(nameRef.current, {
      scale: 1.05,
      translateY: -10,
      transformOrigin: 'left bottom',
      ease: 'power1.inOut',
    })
    gsap.to(buttonRef.current, {
      translateY: -10,
      ease: 'power1.inOut',
    })
  }
  const handleMouseLeave = () => {
    gsap.to(containerRef.current, {
      rotationY: 0,
      rotationX: 0,
      ease: 'power4.in',
      duration: 0.3,
      overwrite: 'auto',
      boxShadow: '0px 0px 0px 0 rgba(169, 9, 9, 0.7)',
      onComplete: () => {
        gsap.to(containerRef.current, {
          boxShadow: '0px 0px 0px 0 rgba(0, 0, 0, 0)',
          duration: 1.2,
        })
      },
    })
    gsap.to(imgRef.current, {
      scale: 1,
      rotationY: 0,
      rotationX: 0,
      translateY: 0,
      zIndex: 1,
      ease: 'power1.inOut',
    })
    gsap.to(nameRef.current, {
      scale: 1,
      translateY: 0,
      ease: 'power1.inOut',
    })
    gsap.to(buttonRef.current, {
      translateY: 0,
      ease: 'power1.inOut',
    })
  }
  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="max-w-88 relative mb-[20px] flex h-full w-full flex-col items-center justify-between rounded-sm p-2 transition-all"
    >
      <div className="absolute left-0 top-0 flex flex-col gap-1 text-[11px] font-medium text-white sm:text-xs lg:text-sm xl:text-base">
        {product.badges.map((badge) => (
          <div
            key={badge.type}
            className={`icon-${badge.type} relative z-10 flex w-fit items-center rounded-sm px-2 py-[2px] uppercase ${
              badge.type === 'top'
                ? 'bg-[#EC9006]'
                : badge.type === 'new'
                  ? 'bg-[#07C70D]'
                  : 'bg-[#A90909]'
            }`}
          >
            {badge.label}
          </div>
        ))}
      </div>
      <div className="max-w-58 grid place-content-center px-2 py-8">
        <Image
          ref={imgRef as React.Ref<HTMLImageElement>}
          src={product.img}
          alt={product.name}
          width={229}
          height={229}
          className="relative aspect-square w-full object-cover"
        />
      </div>
      <div className="relative mb-6 text-[11px] font-medium text-white sm:absolute sm:right-0 sm:top-0 sm:mb-0 sm:text-xs lg:text-sm xl:text-base">
        {product.available ? (
          <div className="icon-available flex w-fit items-center rounded-sm bg-[#0c0c0c] px-2 pb-[2px]">
            В наявності
          </div>
        ) : (
          <div className="icon-non-available flex w-fit items-center rounded-sm bg-[#7D7D7D] px-2 pb-[2px]">
            Немає в наявності
          </div>
        )}
      </div>
      <div className="flex w-full grow flex-col gap-[40px]">
        <div className="flex items-center justify-between gap-2">
          <h3
            ref={nameRef as React.Ref<HTMLDivElement>}
            className="text-xs font-medium uppercase sm:text-sm md:text-base lg:text-lg xl:text-xl"
          >
            {product.name}
          </h3>
          <div className="sm:text-md flex w-[80px] shrink-0 items-center text-nowrap text-base font-medium sm:w-[90px] md:w-[100px] md:text-lg xl:text-xl">
            <Select
              onValueChange={(value) => setSelectedWeightIndex(Number(value))}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={product.weight[selectedWeightIndex]}
                />
              </SelectTrigger>
              <SelectContent>
                {product.weight.map((weight, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {weight}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex grow items-end justify-between">
          <div>
            {selectedNewPrice ? (
              <>
                {selectedPrice && (
                  <p className="text-xs font-semibold text-[#7D7D7D] line-through sm:text-sm md:text-base lg:text-lg xl:text-lg">
                    {selectedPrice} грн
                  </p>
                )}
                <p className="text-sm font-semibold sm:text-base lg:text-lg xl:text-xl">
                  {selectedNewPrice} грн
                </p>
              </>
            ) : (
              selectedPrice && (
                <p className="text-sm font-semibold sm:text-base lg:text-lg xl:text-xl">
                  {selectedPrice} грн
                </p>
              )
            )}
          </div>
          <div ref={buttonRef as React.Ref<HTMLDivElement>}>
            <Button type="button" variant="button">
              До кошика
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product
