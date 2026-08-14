import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

interface ChartShellProps {
  title: string
  description: string
  children: ReactNode
  className?: string
  contentClassName?: string
  action?: ReactNode
}

export function ChartShell({
  title,
  description,
  children,
  className,
  contentClassName,
  action,
}: ChartShellProps) {
  return (
    <section
      aria-label={title}
      className={cn(
        'border-border bg-card min-w-0 rounded-xl border shadow-sm',
        className,
      )}
    >
      <div className="border-border flex min-h-20 items-start justify-between gap-4 border-b px-4 py-4 sm:px-5">
        <div className="min-w-0">
          <h2 className="font-medium">{title}</h2>
          <p className="text-muted-foreground mt-1 text-xs leading-relaxed sm:text-sm">
            {description}
          </p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={cn('p-4 sm:p-5', contentClassName)}>{children}</div>
    </section>
  )
}

interface EmptyChartStateProps {
  title?: string
  description: string
}

export function EmptyChartState({
  title = 'Немає даних',
  description,
}: EmptyChartStateProps) {
  return (
    <div className="border-border bg-muted/30 flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed px-5 text-center">
      <p className="font-medium">{title}</p>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}
