import type { ReactNode } from 'react'
import type { Metadata } from 'next'

import { routing } from '@/i18n/routing'
import { fetchTags } from '@/data/fetch-tags'

import { NextIntlClientProvider } from 'next-intl'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { getMessages } from 'next-intl/server'
import { Rubik_Doodle_Shadow, DM_Sans, Montserrat } from 'next/font/google'
import { seedCategories } from '@/server/seed/category'

import Header from '@/components/client/header'
import { Toaster } from '@/components/admin/ui/toaster'
import Footer from '@/components/client/footer/footer'
import NotFoundPage from '@/components/not-found'
import { GoogleAnalytics } from '@/components/client/google-analytics'

import '../globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800'],
})

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-rubik-doodle-shadow',
  weight: ['400'],
})

const DMSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['400'],
})

export const metadata: Metadata = {
  title: `Slice Dry's`,
  description: 'The best dried products',
}

interface ILocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: LanguageType }>
}

export default async function LocaleLayout(props: ILocaleLayoutProps) {
  const SITE_URL: string | undefined = process.env.NEXT_URL
  const params = await props.params

  const { locale } = params
  const { children } = props

  if (!routing.locales.includes(locale as ILocale)) {
    return (
      <html>
        <body>
          <NotFoundPage />
        </body>
      </html>
    )
  }

  const messages = await getMessages()

  const categoriesData = await fetch(`${SITE_URL}/api/categories`, {
    cache: 'force-cache',
    next: { tags: [`${fetchTags.menu}`] },
  }).then((res) => res.json())

  if (process.env.NODE_ENV === 'development') {
    await seedCategories()
  }

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${rubikDoodleShadow.variable} ${DMSans.variable}`}
    >
      <SpeedInsights />

      <GoogleAnalytics />

      <NextIntlClientProvider messages={messages}>
        <body className="flex min-h-svh flex-col">
          <Header productLinks={categoriesData.data} />

          <main className="flex-1">{children}</main>

          <Footer productLinks={categoriesData.data} />

          <Toaster />
        </body>
      </NextIntlClientProvider>
    </html>
  )
}
