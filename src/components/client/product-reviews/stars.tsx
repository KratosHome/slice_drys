import { Star } from 'lucide-react'

export function ReviewStars({
  rating,
  label,
}: {
  rating: number
  label: string
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className="inline-flex gap-0.5 text-amber-600"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className="relative h-5 w-5">
          <Star aria-hidden="true" className="absolute inset-0 h-5 w-5" />
          <span
            className="absolute inset-y-0 left-0 overflow-hidden"
            style={{
              width: `${Math.max(0, Math.min(1, rating - star + 1)) * 100}%`,
            }}
          >
            <Star aria-hidden="true" className="h-5 w-5 fill-current" />
          </span>
        </span>
      ))}
    </span>
  )
}
