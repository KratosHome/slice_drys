import type { Metadata } from 'next'

import ProductReviewsModeration from '@/components/admin/reviews/product-reviews-moderation'
import { requireAdminPagePermission } from '@/server/auth/require-admin-page.server'

export const metadata: Metadata = {
  title: 'Відгуки | Адмін панель',
}

export default async function ReviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const identity = await requireAdminPagePermission(locale, 'reviews:manage')

  if (!identity) return null

  return (
    <section className="px-5 py-6">
      <h1 className="text-2xl font-semibold sm:text-3xl">Відгуки про товари</h1>
      <p className="text-muted-foreground mt-2 max-w-3xl text-sm leading-6">
        Перевіряйте відгуки, фото та відповіді перед публікацією. Рейтинг товару
        враховує тільки схвалені відгуки. Відповіді на нього не впливають.
      </p>
      <ProductReviewsModeration />
    </section>
  )
}
