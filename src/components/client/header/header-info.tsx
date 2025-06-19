'use client'

import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

interface IHeaderInfoProps {
  title: string
}

export default function HeaderInfo({ title }: IHeaderInfoProps) {
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
    <div
      ref={infoRef}
      className="bg-foreground absolute top-0 h-8 w-full opacity-0"
    >
      <p className="text-background text-center text-base leading-[180%] font-medium">
        {title}
      </p>
    </div>
  )
}
