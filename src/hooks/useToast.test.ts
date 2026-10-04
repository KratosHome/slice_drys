import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Toast } from '@base-ui/react/toast'
import type { ToastManager } from '@base-ui/react/toast'
import {
  isToastRendererRequested,
  mountToastRenderer,
  subscribeToastRenderer,
  toast,
  type ToastData,
} from './useToast'

type ToastManagerEvent = Parameters<
  Parameters<ToastManager<ToastData>[' subscribe']>[0]
>[0]

test('retains the latest toast and its updates while the renderer is loading', () => {
  const events: ToastManagerEvent[] = []
  const manager = Toast.createToastManager<ToastData>()
  const unsubscribeManager = manager[' subscribe']((event) =>
    events.push(event),
  )
  let rendererRequests = 0
  const unsubscribeRenderer = subscribeToastRenderer(() => rendererRequests++)
  let firstClosed = 0
  let secondClosed = 0

  assert.equal(isToastRendererRequested(), false)
  toast({ title: 'First', onOpenChange: () => firstClosed++ })
  const latest = toast({ title: 'Second', onOpenChange: () => secondClosed++ })
  latest.update({
    title: 'Updated',
    description: 'Queued detail',
    duration: Infinity,
    variant: 'destructive',
  })
  assert.equal(firstClosed, 1)
  assert.equal(isToastRendererRequested(), true)
  assert.equal(rendererRequests, 1)
  assert.equal(events.length, 0)

  const unmount = mountToastRenderer(manager)
  assert.equal(events.length, 1)
  assert.equal(events[0].action, 'add')
  assert.equal(events[0].options.id, latest.id)
  assert.equal(events[0].options.title, 'Updated')
  assert.equal(events[0].options.description, 'Queued detail')
  assert.equal(events[0].options.timeout, 0)
  assert.equal(events[0].options.type, 'destructive')
  unmount()
  const unmountRemounted = mountToastRenderer(manager)
  assert.equal(events.length, 2)
  assert.equal(events[1].action, 'add')
  assert.equal(events[1].options.id, latest.id)
  assert.equal(events[1].options.title, 'Updated')
  events[1].options.onClose()
  assert.equal(secondClosed, 1)

  const active = toast({ title: 'Already mounted' })
  assert.equal(events.at(-1)?.action, 'add')
  assert.equal(events.at(-1)?.options.id, active.id)
  active.dismiss()
  assert.equal(events.at(-1)?.action, 'close')
  assert.equal(events.at(-1)?.options.id, active.id)
  unmountRemounted()

  const dismissed = toast({
    title: 'Dismissed while loading',
    onOpenChange: () => secondClosed++,
  })
  dismissed.dismiss()
  assert.equal(secondClosed, 2)
  const eventsBeforeMount = events.length
  const unmountAgain = mountToastRenderer(manager)
  assert.equal(events.length, eventsBeforeMount)
  unmountAgain()
  unsubscribeRenderer()
  unsubscribeManager()
})
