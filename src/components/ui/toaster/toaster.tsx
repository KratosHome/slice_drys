'use client'

import { Toast as ToastPrimitive } from '@base-ui/react/toast'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
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
import { mountToastRenderer, type ToastData } from '@/hooks/useToast'

const toastManager = ToastPrimitive.createToastManager<ToastData>()

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager<ToastData>()
  const t = useTranslations('cart')

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
              <ToastClose aria-label={t('close')} />
            </ToastContent>
          </Toast>
        ))}
      </ToastViewport>
    </ToastPortal>
  )
}

export default function Toaster() {
  useEffect(() => mountToastRenderer(toastManager), [])

  return (
    <ToastProvider toastManager={toastManager} limit={1} timeout={5000}>
      <ToastList />
    </ToastProvider>
  )
}
