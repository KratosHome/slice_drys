'use client'

import dynamic from 'next/dynamic'
import { useSyncExternalStore } from 'react'
import {
  isToastRendererRequested,
  subscribeToastRenderer,
} from '@/hooks/useToast'

const ToastRenderer = dynamic(() => import('./toaster'), {
  ssr: false,
})

const getServerSnapshot = () => false

export default function Toaster() {
  const requested = useSyncExternalStore(
    subscribeToastRenderer,
    isToastRendererRequested,
    getServerSnapshot,
  )

  return requested ? <ToastRenderer /> : null
}
