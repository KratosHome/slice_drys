import type { ReactNode } from 'react'
import type { Metadata } from 'next'

import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Rubik_Doodle_Shadow, DM_Sans, Montserrat } from 'next/font/google'
import { seedCategories } from '@/server/seed/category'

import '../globals.css'
import { routing } from '@/i18n/routing'
import NotFoundPage from '@/components/not-found'
import { GoogleTagManager } from '@/components/client/google-tag-manager/google-tag-manager'
import { SpeedInsights } from '@vercel/speed-insights/next'

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
  title: 'Slice Drys',
  description: 'Generated by create next app',
}

export default async function LocaleLayout(props: {
  children: ReactNode
  params: Promise<{ locale: LanguageType }>
}) {
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

  if (process.env.NODE_ENV === 'development') {
    await seedCategories()
  }

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${rubikDoodleShadow.variable} ${DMSans.variable}`}
    >
      <SpeedInsights />
      <GoogleTagManager />
      <NextIntlClientProvider messages={messages}>
        <body className="flex min-h-svh flex-col">
          <main className="flex-1">children</main>
        </body>
      </NextIntlClientProvider>
    </html>
  )
}

/*

  const categoriesData = await fetch(`${url}/api/categories`, {
    cache: 'force-cache',
    next: { tags: [`${fetchTags.menu}`] },
  }).then((res) => res.json())
   <Header productLinks={categoriesData.data} />

             <Footer productLinks={categoriesData.data} />

                       <Toaster />
 */
