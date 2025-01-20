import { useTranslations } from 'next-intl'

export default function AboutUs() {
  const t = useTranslations('FAQ')
  return (
    <div>
      <div>{t('title')}</div>
      <div>{t('subtitle')}</div>
    </div>
  )
}
