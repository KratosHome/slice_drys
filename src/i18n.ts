import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

const locales = ['uk', 'en']

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale
  if (!locales.includes(locale as ILocale)) notFound()

  return {
    locale,
    messages: (await import(`../localization/${locale}.json`)).default,
  }
})
