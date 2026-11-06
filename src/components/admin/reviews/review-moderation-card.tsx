'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShieldCheck, Star, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { REVIEW_MAX_TEXT_LENGTH } from '@/constants/product-review'
import type { AdminProductReview, ReviewStatus } from '@/types/product-review'

export const REVIEW_STATUS_LABELS: Record<ReviewStatus, string> = {
  pending: 'Очікує перевірки',
  approved: 'Схвалено',
  rejected: 'Відхилено',
  hidden: 'Приховано',
}

export type ReviewModerationAction =
  | { id: string; kind: 'status'; status: ReviewStatus }
  | { id: string; kind: 'delete' }
  | { id: string; kind: 'reply'; text: string }

const moderationActions: { status: ReviewStatus; label: string }[] = [
  { status: 'approved', label: 'Схвалити' },
  { status: 'rejected', label: 'Відхилити' },
  { status: 'hidden', label: 'Приховати' },
  { status: 'pending', label: 'На перевірку' },
]

export default function ReviewModerationCard({
  item,
  disabled,
  onAction,
}: {
  item: AdminProductReview
  disabled: boolean
  onAction: (action: ReviewModerationAction) => Promise<boolean>
}) {
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')

  return (
    <article className="border-border bg-card rounded-xl border p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold break-words">{item.productName}</h2>
          <p className="text-muted-foreground mt-1 text-xs break-all">
            {item.productSlug}
          </p>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-medium ${
            item.status === 'approved'
              ? 'border-green-600/30 bg-green-500/10 text-green-700 dark:text-green-400'
              : item.status === 'pending'
                ? 'border-amber-600/30 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                : 'border-border text-muted-foreground bg-muted/50'
          }`}
        >
          {REVIEW_STATUS_LABELS[item.status]}
        </span>
      </div>

      <div className="text-muted-foreground mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="text-foreground font-medium">{item.author}</span>
        {item.isStoreRepresentative && (
          <span className="inline-flex items-center gap-1 text-xs">
            <ShieldCheck className="size-4" aria-hidden="true" />
            Представник магазину
          </span>
        )}
        <time dateTime={item.createdAt}>
          {new Intl.DateTimeFormat('uk-UA', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Europe/Kyiv',
          }).format(new Date(item.createdAt))}
        </time>
        <span>{item.parentId ? 'Відповідь' : 'Відгук'}</span>
        {item.rating !== null && (
          <span
            className="inline-flex items-center gap-1 font-medium"
            aria-label={`Оцінка: ${item.rating} з 5`}
          >
            <Star
              className="size-4 fill-amber-500 text-amber-500"
              aria-hidden="true"
            />
            {item.rating} / 5
          </span>
        )}
      </div>

      {item.parentId && (
        <blockquote className="border-border bg-muted/40 text-muted-foreground mt-3 rounded-r-lg border-l-2 p-3 text-sm">
          <span className="mb-1 block font-medium">Основний відгук</span>
          <p className="break-words whitespace-pre-wrap">
            {item.parentText ?? 'Відгук недоступний'}
          </p>
        </blockquote>
      )}
      <p className="mt-3 text-sm leading-6 break-words whitespace-pre-wrap">
        {item.text}
      </p>

      {item.photos.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {item.photos.map((photo, index) => (
            <Dialog key={photo.url}>
              <DialogTrigger
                className="border-border relative size-24 cursor-zoom-in overflow-hidden rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-2"
                aria-label={`Збільшити фото ${index + 1} відгуку ${item.author}`}
              >
                <Image
                  src={photo.url}
                  unoptimized
                  alt={`Фото товару від ${item.author}`}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </DialogTrigger>
              <DialogContent className="max-w-4xl gap-4">
                <DialogTitle className="pr-8">
                  Фото відгуку — {item.productName}
                </DialogTitle>
                <DialogDescription>
                  Автор: {item.author}. Фото {index + 1} із {item.photos.length}
                  .
                </DialogDescription>
                <div className="relative h-[65vh] w-full">
                  <Image
                    src={photo.url}
                    unoptimized
                    alt={`Фото товару від ${item.author}`}
                    fill
                    sizes="(max-width: 900px) 90vw, 850px"
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        {moderationActions
          .filter(({ status }) => status !== item.status)
          .map(({ status, label }) => (
            <Button
              key={status}
              type="button"
              size="sm"
              variant={status === 'approved' ? 'default' : 'outline'}
              disabled={disabled}
              onClick={() =>
                void onAction({ id: item.id, kind: 'status', status })
              }
            >
              {label}
            </Button>
          ))}
        {!item.parentId && item.status === 'approved' && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={disabled}
            aria-expanded={replyOpen}
            aria-controls={`reply-${item.id}`}
            onClick={() => setReplyOpen((open) => !open)}
          >
            Відповісти від магазину
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="text-destructive"
                disabled={disabled}
              />
            }
          >
            <Trash2 className="size-4" aria-hidden="true" />
            Видалити
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Видалити {item.parentId ? 'відповідь' : 'відгук'} назавжди?
              </AlertDialogTitle>
              <AlertDialogDescription>
                {item.parentId
                  ? `Відповідь автора «${item.author}» до товару «${item.productName}» буде повністю видалено.`
                  : `Відгук автора «${item.author}» до товару «${item.productName}», усі його фото та відповіді буде повністю видалено. Рейтинг товару зміниться.`}{' '}
                Відновити їх буде неможливо.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Скасувати</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90 text-white"
                disabled={disabled}
                onClick={() => void onAction({ id: item.id, kind: 'delete' })}
              >
                Видалити назавжди
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {replyOpen && !item.parentId && item.status === 'approved' && (
        <form
          id={`reply-${item.id}`}
          className="border-border mt-5 border-t pt-4"
          onSubmit={async (event) => {
            event.preventDefault()
            if (!replyText.trim()) return
            if (
              await onAction({
                id: item.id,
                kind: 'reply',
                text: replyText.trim(),
              })
            ) {
              setReplyText('')
              setReplyOpen(false)
            }
          }}
        >
          <label
            htmlFor={`reply-text-${item.id}`}
            className="block text-sm font-medium"
          >
            Відповідь представника магазину
          </label>
          <textarea
            id={`reply-text-${item.id}`}
            className="border-input bg-background mt-2 min-h-28 w-full rounded-md border p-3 text-sm"
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            required
            maxLength={REVIEW_MAX_TEXT_LENGTH}
            disabled={disabled}
          />
          <p className="text-muted-foreground mt-1 text-xs">
            Відповідь також очікуватиме схвалення перед публікацією.
          </p>
          <Button
            type="submit"
            size="sm"
            className="mt-3"
            disabled={disabled || !replyText.trim()}
          >
            Надіслати на перевірку
          </Button>
        </form>
      )}
    </article>
  )
}
