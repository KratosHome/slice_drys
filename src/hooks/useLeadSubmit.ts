'use client'

import { useRef } from 'react'
import { toast } from '@/hooks/useToast'
import { trackLead } from '@/utils/analytics'

export function useLeadSubmit<T>(
  form: 'callback' | 'wholesale',
  send: (data: T) => Promise<{ success: boolean }>,
  onSuccess: () => void,
  errorMessage: string,
) {
  const pending = useRef<Promise<void> | null>(null)

  async function submit(data: T) {
    let result: { success: boolean } | undefined
    try {
      result = await send(data)
    } catch {
      // Without a positive server response the shopper can retry the same form.
    }
    if (result?.success !== true) {
      toast({ title: errorMessage, variant: 'destructive' })
      return
    }
    trackLead(form)
    onSuccess()
  }

  return (data: T) => {
    // Share the same action and completion handlers across overlapping submits,
    // including two Enter presses before the disabled button re-renders.
    pending.current ??= submit(data).finally(() => {
      pending.current = null
    })
    return pending.current
  }
}
