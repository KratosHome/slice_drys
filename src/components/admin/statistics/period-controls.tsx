'use client'

import { CalendarRange } from 'lucide-react'
import { useState } from 'react'

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
import {
  ADMIN_STATISTICS_MAX_CUSTOM_DAYS,
  ADMIN_STATISTICS_PERIODS,
  isAdminStatisticsPeriod,
} from '@/constants/admin-statistics'
import type { AdminStatisticsPeriod } from '@/types/admin-statistics'
import { cn } from '@/utils/cn'

const PERIOD_LABELS: Record<AdminStatisticsPeriod, string> = {
  all: 'За весь час',
  today: 'Сьогодні',
  '7d': '7 днів',
  '30d': '30 днів',
  '90d': '90 днів',
  'this-year': 'Цей рік',
  custom: 'Свій період',
}

interface PeriodControlsProps {
  period: AdminStatisticsPeriod
  from: string
  to: string
  isPending: boolean
  onPeriodChange: (period: Exclude<AdminStatisticsPeriod, 'custom'>) => void
  onCustomApply: (from: string, to: string) => void
}

function getInclusiveDayCount(from: string, to: string): number {
  const fromDate = Date.parse(`${from}T00:00:00Z`)
  const toDate = Date.parse(`${to}T00:00:00Z`)

  if (!Number.isFinite(fromDate) || !Number.isFinite(toDate)) return 0

  return Math.floor((toDate - fromDate) / 86_400_000) + 1
}

export function PeriodControls({
  period,
  from,
  to,
  isPending,
  onPeriodChange,
  onCustomApply,
}: PeriodControlsProps) {
  const [showCustom, setShowCustom] = useState(period === 'custom')
  const [draftFrom, setDraftFrom] = useState(from)
  const [draftTo, setDraftTo] = useState(to)
  const [error, setError] = useState<string | null>(null)

  const selectedPeriod: AdminStatisticsPeriod = showCustom ? 'custom' : period

  const selectPeriod = (nextPeriod: AdminStatisticsPeriod) => {
    setError(null)

    if (nextPeriod === 'custom') {
      setShowCustom(true)
      return
    }

    setShowCustom(false)
    onPeriodChange(nextPeriod)
  }

  const applyCustomPeriod = () => {
    if (!draftFrom || !draftTo) {
      setError('Оберіть початкову та кінцеву дату.')
      return
    }

    if (draftFrom > draftTo) {
      setError('Початкова дата не може бути пізнішою за кінцеву.')
      return
    }

    const dayCount = getInclusiveDayCount(draftFrom, draftTo)

    if (dayCount <= 0 || dayCount > ADMIN_STATISTICS_MAX_CUSTOM_DAYS) {
      setError(
        `Період має містити не більше ${ADMIN_STATISTICS_MAX_CUSTOM_DAYS.toLocaleString('uk-UA')} днів.`,
      )
      return
    }

    setError(null)
    onCustomApply(draftFrom, draftTo)
  }

  return (
    <fieldset disabled={isPending} className="min-w-0">
      <legend className="sr-only">Період статистики</legend>

      <div className="sm:hidden">
        <Label htmlFor="statistics-period">Період</Label>
        <Select
          value={selectedPeriod}
          onValueChange={(value) => {
            if (isAdminStatisticsPeriod(value)) selectPeriod(value)
          }}
        >
          <SelectTrigger id="statistics-period" className="mt-2 h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ADMIN_STATISTICS_PERIODS.map((option) => (
              <SelectItem key={option} value={option}>
                {PERIOD_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div
        className="hidden flex-wrap gap-2 sm:flex"
        role="group"
        aria-label="Швидкий вибір періоду"
      >
        {ADMIN_STATISTICS_PERIODS.map((option) => {
          const isActive = selectedPeriod === option

          return (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={isActive ? 'default' : 'outline'}
              aria-pressed={isActive}
              onClick={() => selectPeriod(option)}
            >
              {PERIOD_LABELS[option]}
            </Button>
          )
        })}
      </div>

      {showCustom ? (
        <div className="border-border bg-muted/30 mt-4 rounded-lg border p-3 sm:p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarRange className="size-4" aria-hidden="true" />
            Власний діапазон
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,12rem)_minmax(0,12rem)_auto] sm:items-end">
            <div>
              <Label htmlFor="statistics-from">Від</Label>
              <Input
                id="statistics-from"
                type="date"
                className="bg-background mt-1.5"
                value={draftFrom}
                max={draftTo || undefined}
                onChange={(event) => {
                  setDraftFrom(event.target.value)
                  setError(null)
                }}
              />
            </div>
            <div>
              <Label htmlFor="statistics-to">До</Label>
              <Input
                id="statistics-to"
                type="date"
                className="bg-background mt-1.5"
                value={draftTo}
                min={draftFrom || undefined}
                onChange={(event) => {
                  setDraftTo(event.target.value)
                  setError(null)
                }}
              />
            </div>
            <Button type="button" onClick={applyCustomPeriod}>
              Застосувати
            </Button>
          </div>
          <p
            className={cn(
              'mt-2 min-h-5 text-xs',
              error ? 'text-destructive' : 'text-muted-foreground',
            )}
            role={error ? 'alert' : undefined}
          >
            {error ?? 'Обидві дати включаються до статистики.'}
          </p>
        </div>
      ) : null}
    </fieldset>
  )
}
