'use client'

import { useEffect, useRef } from 'react'
import { Item } from './item'

export default function FaqItems({ data }: { data: IFaq[] }) {
  const faqRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const firstItem = faqRef.current[0]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (
      !firstItem ||
      reducedMotion.matches ||
      !('IntersectionObserver' in window)
    )
      return

    let disposed = false
    let context: { revert: () => void } | undefined
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return
      observer.disconnect()
      void import('gsap')
        .then(({ gsap }) => {
          if (disposed || reducedMotion.matches) return
          context = gsap.context(() => {
            gsap.fromTo(
              faqRef.current,
              { opacity: 0, y: 50 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: 'power1.out',
              },
            )
          })
        })
        .catch(() => {
          // Questions remain usable if the optional animation cannot load.
        })
    })
    const stopForReducedMotion = () => {
      if (!reducedMotion.matches) return
      disposed = true
      observer.disconnect()
      context?.revert()
    }
    reducedMotion.addEventListener('change', stopForReducedMotion)
    observer.observe(firstItem)
    return () => {
      disposed = true
      observer.disconnect()
      reducedMotion.removeEventListener('change', stopForReducedMotion)
      context?.revert()
    }
  }, [])

  return (
    <div className="mt-[clamp(32px,calc(32px+84*(100vw-375px)/1065),116px)]">
      {data.map((item, index) => (
        <Item
          ref={(element) => {
            if (element) faqRef.current[index] = element
          }}
          key={item.title}
          question={item.title}
          answer={item.description}
        />
      ))}
    </div>
  )
}
