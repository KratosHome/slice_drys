const PAGE_TRANSITION_CLASS = 'page-transition'
const PAGE_TRANSITION_BRAND_CLASS = '.page-transition-brand'
const PAGE_TRANSITION_BRAND_SELECTOR = `body > ${PAGE_TRANSITION_BRAND_CLASS}`
const PAGE_TRANSITION_STATUS_SELECTOR = '.page-transition-status'
const PAGE_TRANSITION_TIMEOUT = 550
const TRANSITION_SAFETY_TIMEOUT = 8_000

let safetyTimeoutId: number | undefined
let transitionInProgress = false

function clearSafetyTimeout(): void {
  if (safetyTimeoutId === undefined) return

  window.clearTimeout(safetyTimeoutId)
  safetyTimeoutId = undefined
}

function setPageContentInert(inert: boolean): void {
  document
    .querySelectorAll<HTMLElement>(
      `body > :not(${PAGE_TRANSITION_BRAND_CLASS}):not(${PAGE_TRANSITION_STATUS_SELECTOR}):not(script):not(style)`,
    )
    .forEach((element) => {
      element.inert = inert
    })
}

function waitForBrandToCoverPage(brand: HTMLElement): Promise<void> {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    const finish = (): void => {
      window.clearTimeout(timeoutId)
      brand.removeEventListener('transitionend', handleTransitionEnd)
      brand.removeEventListener('transitioncancel', handleTransitionEnd)
      resolve()
    }

    const handleTransitionEnd = (event: TransitionEvent): void => {
      if (event.target === brand && event.propertyName === 'opacity') {
        finish()
      }
    }

    brand.addEventListener('transitionend', handleTransitionEnd)
    brand.addEventListener('transitioncancel', handleTransitionEnd)
    const timeoutId = window.setTimeout(finish, PAGE_TRANSITION_TIMEOUT)
  })
}

export function finishPageTransition(): void {
  if (typeof document === 'undefined') return

  document.body.classList.remove(PAGE_TRANSITION_CLASS)
  setPageContentInert(false)
  transitionInProgress = false
  clearSafetyTimeout()
}

export function isPageTransitionInProgress(): boolean {
  return transitionInProgress
}

export function setPageTransitionFallback(
  href: string,
  replace: boolean,
): void {
  clearSafetyTimeout()

  safetyTimeoutId = window.setTimeout(() => {
    if (!transitionInProgress) return

    if (replace) {
      window.location.replace(href)
    } else {
      window.location.assign(href)
    }
  }, TRANSITION_SAFETY_TIMEOUT)
}

export async function startPageTransition(): Promise<boolean> {
  if (typeof document === 'undefined' || transitionInProgress) return false

  transitionInProgress = true

  const brand = document.querySelector<HTMLElement>(
    PAGE_TRANSITION_BRAND_SELECTOR,
  )

  if (!brand) {
    transitionInProgress = false
    return false
  }

  setPageContentInert(true)

  // Commit the resting state before fading the brand layer in.
  void brand.offsetHeight

  const brandCoveredPage = waitForBrandToCoverPage(brand)
  document.body.classList.add(PAGE_TRANSITION_CLASS)

  await brandCoveredPage

  return transitionInProgress
}
