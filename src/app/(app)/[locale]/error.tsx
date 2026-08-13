'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useLocale()
  const isUkrainian = locale === 'uk'

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <section className="mx-auto flex min-h-[50vh] max-w-[720px] flex-col items-center justify-center gap-6 px-5 text-center">
      <h1 className="text-4xl font-bold">
        {isUkrainian ? 'Щось пішло не так' : 'Something went wrong'}
      </h1>
      <p>
        {isUkrainian
          ? 'Не вдалося завантажити сторінку. Спробуйте ще раз.'
          : 'The page could not be loaded. Please try again.'}
      </p>
      <button
        type="button"
        onClick={reset}
        className="bg-foreground text-background cursor-pointer px-6 py-3"
      >
        {isUkrainian ? 'Спробувати ще раз' : 'Try again'}
      </button>
    </section>
  )
}
