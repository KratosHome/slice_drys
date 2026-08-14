const PAGE_TRANSITION_ACTIVE_CLASS = 'page-transition-active'
const PAGE_TRANSITION_COMPLETE_CLASS = 'page-transition-complete'
const PAGE_TRANSITION_PROGRESS_SELECTOR = '.page-transition-progress'
const PAGE_TRANSITION_STATUS_SELECTOR = '.page-transition-status'
const PAGE_TRANSITION_START_DELAY = 100
const PAGE_TRANSITION_COMPLETE_DURATION = 340
const PAGE_TRANSITION_SAFETY_TIMEOUT = 12_000

let startTimeoutId: number | undefined
let completeTimeoutId: number | undefined
let safetyTimeoutId: number | undefined
let transitionInProgress = false

function clearTimeoutById(timeoutId: number | undefined): void {
  if (timeoutId === undefined) return

  window.clearTimeout(timeoutId)
}

function clearTransitionTimeouts(): void {
  clearTimeoutById(startTimeoutId)
  clearTimeoutById(completeTimeoutId)
  clearTimeoutById(safetyTimeoutId)

  startTimeoutId = undefined
  completeTimeoutId = undefined
  safetyTimeoutId = undefined
}

function setLoadingStatus(loading: boolean): void {
  const status = document.querySelector<HTMLElement>(
    PAGE_TRANSITION_STATUS_SELECTOR,
  )

  if (status) {
    status.textContent = loading ? (status.dataset.loadingText ?? '') : ''
  }

  if (loading) {
    document.body.setAttribute('aria-busy', 'true')
  } else {
    document.body.removeAttribute('aria-busy')
  }
}

function resetPageTransition(): void {
  document.body.classList.remove(
    PAGE_TRANSITION_ACTIVE_CLASS,
    PAGE_TRANSITION_COMPLETE_CLASS,
  )
  setLoadingStatus(false)
}

export function finishPageTransition(): void {
  if (typeof document === 'undefined') return

  clearTimeoutById(startTimeoutId)
  clearTimeoutById(completeTimeoutId)
  clearTimeoutById(safetyTimeoutId)
  startTimeoutId = undefined
  completeTimeoutId = undefined
  safetyTimeoutId = undefined
  transitionInProgress = false
  setLoadingStatus(false)

  if (!document.body.classList.contains(PAGE_TRANSITION_ACTIVE_CLASS)) {
    resetPageTransition()
    return
  }

  document.body.classList.add(PAGE_TRANSITION_COMPLETE_CLASS)

  completeTimeoutId = window.setTimeout(() => {
    resetPageTransition()
    completeTimeoutId = undefined
  }, PAGE_TRANSITION_COMPLETE_DURATION)
}

export function startPageTransition(): void {
  if (typeof document === 'undefined') return

  clearTransitionTimeouts()
  resetPageTransition()

  transitionInProgress = true

  startTimeoutId = window.setTimeout(() => {
    if (!transitionInProgress) return

    const progress = document.querySelector<HTMLElement>(
      PAGE_TRANSITION_PROGRESS_SELECTOR,
    )

    if (!progress) {
      transitionInProgress = false
      setLoadingStatus(false)
      return
    }

    // Restart the CSS animation when a new navigation supersedes another one.
    void progress.offsetWidth
    setLoadingStatus(true)
    document.body.classList.add(PAGE_TRANSITION_ACTIVE_CLASS)
    startTimeoutId = undefined

    safetyTimeoutId = window.setTimeout(
      finishPageTransition,
      PAGE_TRANSITION_SAFETY_TIMEOUT,
    )
  }, PAGE_TRANSITION_START_DELAY)
}
