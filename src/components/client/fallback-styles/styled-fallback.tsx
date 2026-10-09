'use client'

import '@/app/(app)/homepage-utilities.css'

import type { ReactNode } from 'react'

export default function StyledFallback({ children }: { children: ReactNode }) {
  return <>{children}</>
}
