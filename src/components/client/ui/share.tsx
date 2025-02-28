import { useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'

const Share = () => {
  const t = useTranslations('Share')

  return (
    <div className="mb-10 flex flex-col items-center justify-center gap-5 sm:flex-row">
      <div
        className="text-[26px]"
        style={{ fontFamily: 'var(--font-rubik-doodle-shadow)' }}
      >
        {t('Share')}
      </div>
      <div className="flex gap-3">
        <Link href="https://www.google.com/" className="w-fit" target="_blank">
          <Image
            src={'/icons/facebook.svg'}
            alt={t('facebook icon')}
            width={32}
            height={32}
            className="cursor-pointer"
          />
          <div className="group-data-[focus]:bg-red-500 group-data-[focus]:blur-2xl"></div>
        </Link>
        <Link href="https://www.google.com/" className="w-fit" target="_blank">
          <Image
            src={'/icons/instagram.svg'}
            alt={t('instagram icon')}
            width={32}
            height={32}
            className="cursor-pointer"
          />
          <div className="group-data-[focus]:bg-red-500 group-data-[focus]:blur-2xl"></div>
        </Link>
        <Link href="https://www.google.com/" className="w-fit" target="_blank">
          <Image
            src={'/icons/telegram.svg'}
            alt={t('telegram icon')}
            width={32}
            height={32}
            className="cursor-pointer"
          />
          <div className="group-data-[focus]:bg-red-500 group-data-[focus]:blur-2xl"></div>
        </Link>
      </div>
    </div>
  )
}

export default Share
