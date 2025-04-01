'use client'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

type Props = {
  title: string
}

export default function Info({ title }: Props) {
  const infoRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      infoRef.current,
      { yPercent: -100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.6,
      },
    )
  })

  return (
    <div ref={infoRef} className="absolute top-0 h-8 w-full bg-black opacity-0">
      <p className="text-center text-base font-medium leading-[180%] text-white">
        {title}
      </p>
    </div>
  )
}
