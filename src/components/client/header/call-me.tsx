'use client'

import dynamic from 'next/dynamic'
import { useId, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'

const CallMeDialog = dynamic(() => import('./call-me-dialog'), { ssr: false })

export default function CallMe() {
  const t = useTranslations('main.call-me')
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpenedDialog, setHasOpenedDialog] = useState(false)
  const dialogId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant="button"
        className="max-w-24 sm:max-w-fit"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? dialogId : undefined}
        onClick={() => {
          setHasOpenedDialog(true)
          setIsOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') setIsOpen(false)
        }}
      >
        {t('call-back')}
      </Button>
      {hasOpenedDialog ? (
        <CallMeDialog
          id={dialogId}
          open={isOpen}
          onOpenChange={setIsOpen}
          triggerRef={triggerRef}
        />
      ) : null}
    </>
  )
}
