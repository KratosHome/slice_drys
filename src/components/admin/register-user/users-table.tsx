'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { Archive, ArrowDown, ArrowUp, ShieldCheck } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { USER_ROLE_LABELS } from '@/constants/user-role'
import { getUserSort, type UserSort } from '@/constants/user-sort'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from '@/hooks/useToast'
import { archiveAdminUser } from '@/server/user/archive-admin-user.server'
import type { AdminUserListItem } from '@/types/admin-user'

interface UsersTableProps {
  users: AdminUserListItem[]
  initialSort: UserSort
}

const USER_ROLE_SORT_ORDER = {
  'super-admin': 0,
  client: 1,
  manager: 2,
  developer: 3,
} as const

export default function UsersTable({ users, initialSort }: UsersTableProps) {
  const router = useRouter()
  const [pendingUserId, setPendingUserId] = useState<string | null>(null)
  const [userSort, setUserSort] = useState<UserSort>(initialSort)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const syncSortFromUrl = () => {
      const params = new URLSearchParams(window.location.search)
      setUserSort(getUserSort(params.get('userSort')))
    }

    window.addEventListener('popstate', syncSortFromUrl)

    return () => window.removeEventListener('popstate', syncSortFromUrl)
  }, [])

  const sortedUsers = useMemo(() => {
    const direction = userSort === 'type-asc' ? 1 : -1

    return [...users].sort(
      (firstUser, secondUser) =>
        (USER_ROLE_SORT_ORDER[firstUser.role] -
          USER_ROLE_SORT_ORDER[secondUser.role]) *
        direction,
    )
  }, [userSort, users])

  const toggleTypeSort = () => {
    const nextSort: UserSort =
      userSort === 'type-asc' ? 'type-desc' : 'type-asc'
    const url = new URL(window.location.href)

    url.searchParams.set('userSort', nextSort)
    window.history.pushState(
      null,
      '',
      `${url.pathname}${url.search}${url.hash}`,
    )
    setUserSort(nextSort)
  }

  const handleArchive = (user: AdminUserListItem) => {
    setPendingUserId(user.id)

    startTransition(async () => {
      const result = await archiveAdminUser(user.id)

      if (result.success) {
        toast({
          title: 'Користувача заархівовано',
          description: `${user.email} більше не зможе увійти до системи.`,
        })
        router.refresh()
      } else {
        toast({
          variant: 'destructive',
          title: 'Не вдалося заархівувати',
          description: result.message,
        })
      }

      setPendingUserId(null)
    })
  }

  return (
    <div className="border-border bg-card mt-6 max-w-5xl overflow-hidden rounded-xl border shadow-sm">
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold">Активні користувачі</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Усього: {users.length}
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <p className="text-muted-foreground border-t px-5 py-8 text-center text-sm">
          Активних користувачів немає.
        </p>
      ) : (
        <Table className="min-w-[720px]">
          <TableCaption className="sr-only">
            Список активних користувачів системи
          </TableCaption>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="px-3">Email</TableHead>
              <TableHead className="px-3">ПІБ</TableHead>
              <TableHead
                className="w-48 px-3"
                aria-sort={userSort === 'type-asc' ? 'ascending' : 'descending'}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 px-3"
                  onClick={toggleTypeSort}
                  aria-label={
                    userSort === 'type-asc'
                      ? 'Тип: за зростанням. Змінити на спадання'
                      : 'Тип: за спаданням. Змінити на зростання'
                  }
                >
                  Тип
                  {userSort === 'type-asc' ? (
                    <ArrowUp className="size-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowDown className="size-3.5" aria-hidden="true" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="w-40 px-3 text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => {
              const isArchiving = isPending && pendingUserId === user.id

              return (
                <TableRow key={user.id}>
                  <TableCell className="px-3 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="break-all">{user.email}</span>
                      {user.isCurrentUser ? (
                        <span className="border-border bg-muted text-muted-foreground inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-xs">
                          <ShieldCheck className="size-3" aria-hidden="true" />
                          Ви
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="px-3 py-3">
                    {user.fullName ?? (
                      <span className="text-muted-foreground">Не вказано</span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 py-3">
                    <span className="border-border bg-background inline-flex rounded-full border px-2.5 py-1 text-xs font-medium">
                      {USER_ROLE_LABELS[user.role]}
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-right">
                    {user.isCurrentUser ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled
                        title="Не можна архівувати власний обліковий запис"
                      >
                        <Archive className="size-3.5" aria-hidden="true" />
                        Архівувати
                      </Button>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isPending}
                          >
                            <Archive className="size-3.5" aria-hidden="true" />
                            {isArchiving ? 'Архівація…' : 'Архівувати'}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Архівувати користувача?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {user.email} втратить доступ до системи. Дані не
                              буде видалено, але запис зникне зі списку активних
                              користувачів.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Скасувати</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleArchive(user)}
                            >
                              Архівувати
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
