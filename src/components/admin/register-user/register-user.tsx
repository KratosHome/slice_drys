'use client'

import { useState, type FormEvent } from 'react'
import { UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import {
  USER_ROLES,
  USER_ROLE_DESCRIPTIONS,
  USER_ROLE_LABELS,
  type UserRole,
} from '@/constants/user-role'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/hooks/useToast'

interface CreateUserResponse {
  success: boolean
  message?: string
}

export default function RegisterForm() {
  const router = useRouter()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('client')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({ login, password, role }),
        headers: { 'Content-Type': 'application/json' },
      })
      const data = (await response.json()) as CreateUserResponse

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Не вдалося створити користувача')
      }

      setLogin('')
      setPassword('')
      setRole('client')
      toast({
        title: 'Користувача створено',
        description: `${login.trim().toLowerCase()} — ${USER_ROLE_LABELS[role]}`,
      })
      router.refresh()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не вдалося створити користувача'

      setErrorMessage(message)
      toast({
        variant: 'destructive',
        title: 'Помилка створення',
        description: message,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleRegister}>
      <div className="space-y-2">
        <Label htmlFor="user-login">Логін (email)</Label>
        <Input
          id="user-login"
          type="email"
          name="login"
          autoComplete="off"
          placeholder="user@example.com"
          value={login}
          maxLength={120}
          required
          disabled={isSubmitting}
          onChange={(event) => setLogin(event.target.value)}
        />
        <p className="text-muted-foreground text-xs">
          Цей email користувач вводитиме на сторінці входу.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-password">Пароль</Label>
        <Input
          id="user-password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="Щонайменше 8 символів"
          value={password}
          minLength={8}
          maxLength={72}
          required
          disabled={isSubmitting}
          onChange={(event) => setPassword(event.target.value)}
        />
        <p className="text-muted-foreground text-xs">
          Від 8 символів, максимум 72 байти.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-role">Роль</Label>
        <Select
          value={role}
          disabled={isSubmitting}
          onValueChange={(value) => setRole(value as UserRole)}
        >
          <SelectTrigger id="user-role" className="h-10">
            <SelectValue placeholder="Оберіть роль" />
          </SelectTrigger>
          <SelectContent>
            {USER_ROLES.map((userRole) => (
              <SelectItem key={userRole} value={userRole}>
                {USER_ROLE_LABELS[userRole]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-muted-foreground text-xs">
          {USER_ROLE_DESCRIPTIONS[role]}
        </p>
      </div>

      {errorMessage ? (
        <p role="alert" className="text-destructive text-sm">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        className="w-full sm:w-auto"
        disabled={isSubmitting}
      >
        <UserPlus className="size-4" aria-hidden="true" />
        {isSubmitting ? 'Створення…' : 'Створити користувача'}
      </Button>
    </form>
  )
}
