'use client'

import type { MouseEvent } from 'react'

import Link from 'next/link'

import { useTranslations } from 'next-intl'

interface IShareProps {
  title: string
  url: string
}

export default function Share({ url, title }: IShareProps) {
  const t = useTranslations('share')
  const encodedUrl: string = encodeURIComponent(url)

  const facebookShareUrl: string = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const telegramShareUrl: string = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}`

  const handleInstagramShare = (event: MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault()

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => window.open('https://www.instagram.com', '_blank'))
        .catch((err) => console.error('Не вдалося скопіювати посилання:', err))
    } else {
      console.warn('Clipboard API не підтримується')
      window.open('https://www.instagram.com', '_blank')
    }
  }

  return (
    <div className="mb-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
      <div
        className="text-[26px]"
        style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
      >
        {t('share-label')}
      </div>
      <div className="flex gap-3">
        {/* Додано Tailwind класи для плавного зуму та тіні при наведенні */}
        <Link
          href={facebookShareUrl}
          className="w-fit transform transition-all duration-300 hover:scale-110"
          target="_blank"
        >
          <svg
            width={32}
            height={32}
            role="img"
            aria-label={t('facebook-icon')}
          >
            <use href="/icons/sprite.svg#facebook" />
          </svg>
        </Link>
        <Link
          href="#"
          className="w-fit transform transition-all duration-300 hover:scale-110"
          onClick={handleInstagramShare}
        >
          <svg
            width={32}
            height={32}
            role="img"
            aria-label={t('instagram-icon')}
          >
            <use href="/icons/sprite.svg#instagram" />
          </svg>
        </Link>
        <Link
          href={telegramShareUrl}
          className="w-fit transform transition-all duration-300 hover:scale-110"
          target="_blank"
        >
          <svg
            width={32}
            height={32}
            role="img"
            aria-label={t('telegram-icon')}
          >
            <use href="/icons/sprite.svg#telegram" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
