'use client'

import { useParams } from 'next/navigation'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  return (
    <div>
      <h1>{slug}</h1>
    </div>
  )
}
