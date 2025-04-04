'use client'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { FC } from 'react'

interface shareProps {
  title: string
  url: string
}

const Share: FC<shareProps> = ({ url, title }) => {
  const t = useTranslations('share')
  const encodedUrl = encodeURIComponent(url)

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const telegramShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}`

  const handleInstagramShare = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => {
          window.open('https://www.instagram.com', '_blank')
        })
        .catch((err) => {
          console.error('Не вдалося скопіювати посилання:', err)
        })
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
        {t('Share')}
      </div>
      <div className="flex gap-3">
        {/* Додано Tailwind класи для плавного зуму та тіні при наведенні */}
        <Link
          href={facebookShareUrl}
          className="w-fit transform transition-all duration-300 hover:scale-110"
          target="_blank"
        >
          <Image
            src={'/icons/facebook.svg'}
            alt={t('facebook icon')}
            width={32}
            height={32}
            className="cursor-pointer"
          />
        </Link>
        <Link
          href="#"
          className="w-fit transform transition-all duration-300 hover:scale-110"
          onClick={handleInstagramShare}
        >
          <Image
            src={'/icons/instagram.svg'}
            alt={t('instagram icon')}
            width={32}
            height={32}
            className="cursor-pointer"
          />
        </Link>
        <Link
          href={telegramShareUrl}
          className="w-fit transform transition-all duration-300 hover:scale-110"
          target="_blank"
        >
          <Image
            src={'/icons/telegram.svg'}
            alt={t('telegram icon')}
            width={32}
            height={32}
            className="cursor-pointer"
          />
        </Link>
      </div>
    </div>
  )
}

export default Share
