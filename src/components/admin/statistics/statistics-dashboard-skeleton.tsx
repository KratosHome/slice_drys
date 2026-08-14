import { Skeleton } from '@/components/ui/skeleton'

export function StatisticsDashboardSkeleton() {
  return (
    <div aria-label="Завантаження статистики" aria-busy="true">
      <div className="border-border bg-card rounded-xl border p-4 shadow-sm sm:p-5">
        <Skeleton className="h-9 w-full sm:w-[46rem]" />
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-9 flex-1 sm:max-w-44" />
          <Skeleton className="h-9 flex-1 sm:max-w-44" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card min-h-32 rounded-xl border p-4 shadow-sm"
          >
            <Skeleton className="h-4 w-24 max-w-full" />
            <Skeleton className="mt-5 h-8 w-28 max-w-full" />
            <Skeleton className="mt-3 h-3 w-20 max-w-full" />
          </div>
        ))}
      </div>

      <div className="border-border bg-card mt-4 rounded-xl border p-5 shadow-sm">
        <Skeleton className="h-5 w-64 max-w-full" />
        <Skeleton className="mt-2 h-4 w-[34rem] max-w-full" />
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>

      <div className="border-border bg-card mt-4 rounded-xl border p-5 shadow-sm">
        <Skeleton className="h-5 w-52 max-w-full" />
        <Skeleton className="mt-2 h-4 w-72 max-w-full" />
        <Skeleton className="mt-5 h-72 w-full" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-card rounded-xl border p-5 shadow-sm"
          >
            <Skeleton className="h-5 w-44 max-w-full" />
            <Skeleton className="mt-2 h-4 w-64 max-w-full" />
            <Skeleton className="mt-5 h-64 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
