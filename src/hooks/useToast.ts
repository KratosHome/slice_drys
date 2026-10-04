'use client'

import type { ToastManager } from '@base-ui/react/toast'
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

interface AppToast {
  id: string
  options: ToastOptions
}

let toastManager: ToastManager<ToastData> | undefined
let rendererCount = 0
let nextId = 0
let pendingToast: AppToast | undefined
let activeToast: AppToast | undefined
let rendererRequested = false
const rendererListeners = new Set<() => void>()

function subscribeToastRenderer(listener: () => void) {
  rendererListeners.add(listener)
  return () => {
    rendererListeners.delete(listener)
  }
}

function isToastRendererRequested() {
  return rendererRequested
}

function toManagerOptions(notification: AppToast) {
  const { options } = notification
  return {
    title: options.title,
    description: options.description,
    type: options.variant ?? 'default',
    timeout: options.duration === Infinity ? 0 : options.duration,
    onClose: () => {
      if (activeToast?.id === notification.id) activeToast = undefined
      notification.options.onOpenChange?.(false)
    },
    data: { action: options.action },
  }
}

function dismiss(toastId?: string) {
  if (pendingToast && (!toastId || pendingToast.id === toastId)) {
    const dismissedToast = pendingToast
    pendingToast = undefined
    dismissedToast.options.onOpenChange?.(false)
  }
  if (activeToast && (!toastId || activeToast.id === toastId))
    activeToast = undefined
  toastManager?.close(toastId)
}

function toast(options: ToastOptions) {
  const id = `app-toast-${++nextId}`
  const notification = { id, options }

  // The existing interface displays the latest notification only.
  dismiss()
  if (rendererCount > 0 && toastManager) {
    activeToast = notification
    toastManager.add({ id, ...toManagerOptions(notification) })
  } else {
    pendingToast = notification
  }

  if (!rendererRequested) {
    rendererRequested = true
    rendererListeners.forEach((listener) => listener())
  }

  return {
    id,
    dismiss: () => dismiss(id),
    update: (updates: Partial<ToastOptions>) => {
      if (pendingToast?.id === id) {
        pendingToast.options = { ...pendingToast.options, ...updates }
        return
      }
      if (activeToast?.id === id) {
        activeToast.options = { ...activeToast.options, ...updates }
      }
      toastManager?.update(id, (current) => {
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
        }
      })
    },
  }
}

// Register after the provider subscribes, so notifications created while the
// lazily loaded renderer is mounting are retained.
function mountToastRenderer(manager: ToastManager<ToastData>) {
  toastManager = manager
  rendererCount += 1
  if (pendingToast) {
    activeToast = pendingToast
    pendingToast = undefined
    toastManager.add({
      id: activeToast.id,
      ...toManagerOptions(activeToast),
    })
  }
  return () => {
    rendererCount -= 1
    if (rendererCount === 0) {
      toastManager = undefined
      // Replaying the same ID also restores its timer after Strict Mode cleanup.
      pendingToast = activeToast
      activeToast = undefined
    }
  }
}

function useToast() {
  return { toast, dismiss }
}

export {
  useToast,
  toast,
  mountToastRenderer,
  subscribeToastRenderer,
  isToastRendererRequested,
}
