'use client'

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'

// SSR remains enabled: a rendered fallback gets its stylesheet in the server
// response, while healthy routes do not preload this optional style chunk.
const StyledFallback = dynamic(() => import('./styled-fallback'))

export default function FallbackStyles({ children }: { children: ReactNode }) {
  return <StyledFallback>{children}</StyledFallback>
}
