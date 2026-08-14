'use client'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const LogOut = () => {
  return (
    <div>
      <Button onClick={() => signOut()}>Вийти</Button>
    </div>
  )
}

export default LogOut
