import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function animateReviews(section: HTMLElement, reviews: HTMLLIElement[]) {
  const context = gsap.context(() => {
    reviews.forEach((review, index) => {
      // Leave reviews that are already visible in their server-rendered state.
      if (
        !review.isConnected ||
        review.getBoundingClientRect().top < window.innerHeight
      )
        return

      gsap.from(review, {
        x: index % 2 ? 40 : -40,
        autoAlpha: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: review,
          start: 'top bottom',
          once: true,
        },
      })
    })
  }, section)

  return () => context.revert()
}
