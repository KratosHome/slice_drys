'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import ReviewModerationCard, {
  REVIEW_STATUS_LABELS,
  type ReviewModerationAction,
} from './review-moderation-card'
import {
  REVIEW_STATUSES,
  type AdminProductReviewsData,
  type ReviewStatus,
} from '@/types/product-review'

type ReviewKind = 'all' | 'reviews' | 'replies'

async function fetchReviews(
  status: ReviewStatus | 'all',
  kind: ReviewKind,
  page: number,
  signal: AbortSignal,
): Promise<AdminProductReviewsData> {
  const params = new URLSearchParams({ status, kind, page: String(page) })
  const response = await fetch(`/api/admin/product-reviews?${params}`, {
    cache: 'no-store',
    signal,
  })
  const payload = await response.json()
  if (!response.ok || !payload.success)
    throw new Error(payload.message || 'Не вдалося завантажити відгуки')
  return payload.data
}

export default function ProductReviewsModeration() {
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<ReviewStatus | 'all'>('pending')
  const [kind, setKind] = useState<ReviewKind>('all')
  const [page, setPage] = useState(1)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [actionError, setActionError] = useState('')
  const reviewsQuery = useQuery({
    queryKey: ['admin', 'product-reviews', { status, kind, page }],
    queryFn: ({ signal }) => fetchReviews(status, kind, page, signal),
  })
  const data = reviewsQuery.data
  const totalPages = Math.max(
    1,
    Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 20)),
  )

  const onAction = async (action: ReviewModerationAction): Promise<boolean> => {
    setBusy(true)
    setMessage('')
    setActionError('')
    try {
      const path = `/api/admin/product-reviews/${encodeURIComponent(action.id)}${action.kind === 'reply' ? '/reply' : ''}`
      const response = await fetch(path, {
        method:
          action.kind === 'delete'
            ? 'DELETE'
            : action.kind === 'reply'
              ? 'POST'
              : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:
          action.kind === 'delete'
            ? undefined
            : JSON.stringify(
                action.kind === 'reply'
                  ? { text: action.text }
                  : { status: action.status },
              ),
      })
      const payload = await response.json()
      if (!response.ok || !payload.success)
        throw new Error(payload.message || 'Не вдалося виконати дію')
      setMessage(
        action.kind === 'reply'
          ? 'Відповідь магазину надіслано на перевірку. Знайдіть її у списку «Очікує перевірки» та схваліть для публікації.'
          : action.kind === 'delete'
            ? 'Запис видалено.'
            : `Статус змінено: ${REVIEW_STATUS_LABELS[action.status].toLowerCase()}.`,
      )
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'product-reviews'],
      })
      if (
        data?.items.length === 1 &&
        page > 1 &&
        (action.kind === 'delete' ||
          (action.kind === 'status' && status !== 'all'))
      )
        setPage(page - 1)
      return true
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Не вдалося виконати дію',
      )
      return false
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-6 max-w-5xl">
      <div className="border-border bg-card mb-5 flex flex-wrap items-end gap-3 rounded-xl border p-4">
        <label className="flex min-w-44 flex-col gap-1.5 text-sm">
          Статус
          <select
            className="border-input bg-background h-10 rounded-md border px-3"
            value={status}
            disabled={busy}
            onChange={(event) => {
              setStatus(event.target.value as ReviewStatus | 'all')
              setPage(1)
            }}
          >
            <option value="all">Усі статуси</option>
            {REVIEW_STATUSES.map((value) => (
              <option key={value} value={value}>
                {REVIEW_STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-w-44 flex-col gap-1.5 text-sm">
          Тип
          <select
            className="border-input bg-background h-10 rounded-md border px-3"
            value={kind}
            disabled={busy}
            onChange={(event) => {
              setKind(event.target.value as ReviewKind)
              setPage(1)
            }}
          >
            <option value="all">Відгуки та відповіді</option>
            <option value="reviews">Відгуки</option>
            <option value="replies">Відповіді</option>
          </select>
        </label>
        <Button
          type="button"
          variant="outline"
          disabled={reviewsQuery.isFetching || busy}
          onClick={() => void reviewsQuery.refetch()}
        >
          <RefreshCw
            className={`size-4 ${reviewsQuery.isFetching ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          Оновити
        </Button>
      </div>

      {message && (
        <p
          role="status"
          className="mb-4 rounded-lg border border-green-600/30 bg-green-500/10 p-3 text-sm"
        >
          {message}
        </p>
      )}
      {actionError && (
        <p
          role="alert"
          className="text-destructive mb-4 rounded-lg border border-red-500/30 p-3 text-sm"
        >
          {actionError}
        </p>
      )}
      {reviewsQuery.isError && (
        <p role="alert" className="text-destructive mb-4 text-sm">
          {reviewsQuery.error.message}. Спробуйте оновити список.
        </p>
      )}
      {reviewsQuery.isPending && (
        <p role="status" className="text-muted-foreground py-8 text-sm">
          Завантажуємо відгуки…
        </p>
      )}
      {data && (
        <>
          <p className="text-muted-foreground mb-3 text-sm" aria-live="polite">
            Знайдено: {data.total}
            {reviewsQuery.isFetching ? ' · Оновлюємо…' : ''}
          </p>
          <div
            className="space-y-4"
            aria-busy={busy || reviewsQuery.isFetching}
          >
            {data.items.length ? (
              data.items.map((item) => (
                <ReviewModerationCard
                  key={item.id}
                  item={item}
                  disabled={busy}
                  onAction={onAction}
                />
              ))
            ) : (
              <p className="border-border rounded-xl border p-8 text-center text-sm">
                За вибраними фільтрами немає відгуків або відповідей.
              </p>
            )}
          </div>
          <nav
            aria-label="Сторінки відгуків"
            className="mt-5 flex flex-wrap items-center justify-between gap-3"
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1 || busy || reviewsQuery.isFetching}
              onClick={() => setPage(Math.max(1, page - 1))}
            >
              Попередня
            </Button>
            <span className="text-muted-foreground text-sm">
              Сторінка {page} із {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages || busy || reviewsQuery.isFetching}
              onClick={() => setPage(page + 1)}
            >
              Наступна
            </Button>
          </nav>
        </>
      )}
    </div>
  )
}
