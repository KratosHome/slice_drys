'use client'

import { Toast as ToastPrimitive } from '@base-ui/react/toast'
import { useEffect } from 'react'
import {
  Toast,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import {
  mountToastRenderer,
  toastManager,
  type ToastData,
} from '@/hooks/useToast'

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager<ToastData>()

  return (
    <ToastPortal>
      <ToastViewport>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            variant={toast.type === 'destructive' ? 'destructive' : 'default'}
          >
            <ToastContent className="flex items-center justify-between gap-2">
              <div className="grid gap-1">
                <ToastTitle />
                <ToastDescription />
              </div>
              {toast.data?.action}
              <ToastClose />
            </ToastContent>
          </Toast>
        ))}
      </ToastViewport>
    </ToastPortal>
  )
}

export default function Toaster() {
  useEffect(mountToastRenderer, [])

  return (
    <ToastProvider toastManager={toastManager} limit={1} timeout={5000}>
      <ToastList />
    </ToastProvider>
  )
}
