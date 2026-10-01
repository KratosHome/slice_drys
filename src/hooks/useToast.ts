'use client'

import { Toast as ToastPrimitive } from '@base-ui/react/toast'
import type { ReactNode } from 'react'
import type { ToastActionElement } from '@/components/ui/toast'

interface ToastOptions {
  title?: ReactNode
  description?: ReactNode
  variant?: 'default' | 'destructive'
  duration?: number
  action?: ToastActionElement
  onOpenChange?: (open: boolean) => void
}

export interface ToastData {
  action?: ToastActionElement
}

const toastManager = ToastPrimitive.createToastManager<ToastData>()
let rendererCount = 0
let nextId = 0
let pendingToast: { id: string; options: ToastOptions } | undefined

function toManagerOptions(options: ToastOptions) {
  return {
    title: options.title,
    description: options.description,
    type: options.variant ?? 'default',
    timeout: options.duration === Infinity ? 0 : options.duration,
    onClose: () => options.onOpenChange?.(false),
    data: { action: options.action },
  }
}

function dismiss(toastId?: string) {
  if (pendingToast && (!toastId || pendingToast.id === toastId)) {
    const dismissedToast = pendingToast
    pendingToast = undefined
    dismissedToast.options.onOpenChange?.(false)
  }
  toastManager.close(toastId)
}

function toast(options: ToastOptions) {
  const id = `app-toast-${++nextId}`

  // The existing interface displays the latest notification only.
  dismiss()
  if (rendererCount > 0) {
    toastManager.add({ id, ...toManagerOptions(options) })
  } else {
    pendingToast = { id, options }
  }

  return {
    id,
    dismiss: () => dismiss(id),
    update: (updates: Partial<ToastOptions>) => {
      if (pendingToast?.id === id) {
        pendingToast.options = { ...pendingToast.options, ...updates }
        return
      }
      toastManager.update(id, (current) => {
        return {
          ...('title' in updates && { title: updates.title }),
          ...('description' in updates && { description: updates.description }),
          ...('variant' in updates && { type: updates.variant ?? 'default' }),
          ...('duration' in updates && {
            timeout: updates.duration === Infinity ? 0 : updates.duration,
          }),
          ...('action' in updates && {
            data: { ...current.data, action: updates.action },
          }),
          ...('onOpenChange' in updates && {
            onClose: () => updates.onOpenChange?.(false),
          }),
        }
      })
    },
  }
}

// Register after the provider subscribes, so notifications created while the
// lazily loaded renderer is mounting are retained.
function mountToastRenderer() {
  rendererCount += 1
  if (pendingToast) {
    toastManager.add({
      id: pendingToast.id,
      ...toManagerOptions(pendingToast.options),
    })
    pendingToast = undefined
  }
  return () => {
    rendererCount -= 1
  }
}

function useToast() {
  return { toast, dismiss }
}

export { useToast, toast, toastManager, mountToastRenderer }
