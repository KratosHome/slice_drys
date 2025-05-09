import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const mql: MediaQueryList = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`,
    )

    const onChange = (): void =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    mql.addEventListener('change', onChange)

    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    return (): void => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}
