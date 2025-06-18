'use client'

import Image from 'next/image'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const images: string[] = [
  '/wholesale/wholesale1.webp',
  '/wholesale/wholesale2.webp',
  '/wholesale/wholesale3.webp',
  '/wholesale/wholesale4.webp',
  '/wholesale/wholesale5.webp',
]

export default function LoadingPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, ease: 'linear' })

    images.forEach((_, index) => {
      const angle: number = (360 / images.length) * index

      tl.to(
        `.image-${index}`,
        {
          rotation: '+=360',
          duration: 10,
          transformOrigin: 'center -120px',
          ease: 'linear',
        },
        0,
      )

      gsap.set(`.image-${index}`, {
        rotation: angle,
      })
    })
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center overflow-hidden bg-white"
    >
      <Image
        src="/icons/logo.svg"
        alt="logo"
        width={86}
        height={100}
        className="z-10"
      />

      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute image-${index}`}
          style={{ top: '50%', left: '50%' }}
        >
          <Image
            src={src}
            alt={`wholesale-${index}`}
            width={60}
            height={60}
            className="rounded-full shadow-xl"
          />
        </div>
      ))}
    </div>
  )
}
