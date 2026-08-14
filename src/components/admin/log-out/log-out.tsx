'use client'

import { useState } from 'react'
import { LogOut as LogOutIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { toast } from '@/hooks/useToast'

interface LogOutProps {
  presentation?: 'button' | 'sidebar'
  onSignedOut?: () => void
}

const LogOut = ({ presentation = 'button', onSignedOut }: LogOutProps) => {
  const locale = useLocale()
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleSignOut = async () => {
    if (isPending) return

    setIsPending(true)

    try {
      await signOut({
        redirect: false,
        callbackUrl: `/${locale}/admin`,
      })
      onSignedOut?.()
      router.replace(`/${locale}/admin`)
      router.refresh()
    } catch {
      toast({
        variant: 'destructive',
        title: 'Не вдалося вийти',
        description: 'Спробуйте ще раз.',
      })
      setIsPending(false)
    }
  }

  if (presentation === 'sidebar') {
    return (
      <SidebarMenuButton
        type="button"
        tooltip="Вийти"
        disabled={isPending}
        onClick={handleSignOut}
      >
        <LogOutIcon aria-hidden="true" />
        <span>{isPending ? 'Вихід…' : 'Вийти'}</span>
      </SidebarMenuButton>
    )
  }

  return (
    <Button type="button" disabled={isPending} onClick={handleSignOut}>
      <LogOutIcon aria-hidden="true" />
      {isPending ? 'Вихід…' : 'Вийти'}
    </Button>
  )
}

export default LogOut
