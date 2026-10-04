import { gsap } from 'gsap'

export function animateHero(
  image: HTMLImageElement,
  title: HTMLDivElement,
  decorations: HTMLImageElement[],
  subImages: readonly IHeroAnimationSubImage[],
) {
  const context = gsap.context(() => {
    gsap.fromTo(
      image,
      {
        scaleX: 0.2,
        scaleY: 0.2,
        filter: 'blur(30px)',
      },
      {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'expo',
      },
    )
    gsap.fromTo(
      title,
      {
        opacity: 0,
        scaleX: 1.2,
        scaleY: 1.2,
        filter: 'blur(10px)',
      },
      {
        opacity: 1,
        scaleX: 1,
        scaleY: 1,
        filter: 'blur(0px)',
        duration: 0.2,
        ease: 'power2.out',
      },
    )

    const media = gsap.matchMedia()
    media.add('(min-width: 1024px)', () => {
      decorations.forEach((element, index) => {
        const item = subImages[index]
        if (!item || !element.isConnected) return
        gsap.fromTo(
          element,
          { opacity: 0, x: 0, y: 0 },
          {
            opacity: 1,
            duration: 1.5,
            x: item.position.desktop.x,
            y: item.position.desktop.y,
            ease: 'power2.out',
          },
        )
      })
    })
    return () => media.revert()
  })

  return () => context.revert()
}
