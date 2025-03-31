import type { ReactNode } from 'react'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Rubik_Doodle_Shadow, DM_Sans, Montserrat } from 'next/font/google'

import Header from '@/components/client/header'
import { Toaster } from '@/components/admin/ui/toaster'

import '../globals.css'
import { routing } from '@/i18n/routing'
import NotFoundPage from '@/components/not-found'
import { GoogleTagManager } from '@/components/client/google-tag-manager/google-tag-manager'
import { fetchTags } from '@/data/fetch-tags'
import ScrollToTop from '@/components/client/scroll-to-top/scroll-to-top'
import dynamic from 'next/dynamic'
import { Loader } from 'lucide-react'

const Footer = dynamic(() => import('@/components/client/footer/footer'), {
  loading: () => <Loader />,
})

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
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

const url = process.env.NEXT_URL

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

  const categoriesData = await fetch(`${url}/api/categories`, {
    cache: 'force-cache',
    next: { tags: [`${fetchTags.menu}`] },
  }).then((res) => res.json())

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${rubikDoodleShadow.variable} ${DMSans.variable}`}
    >
      <GoogleTagManager />
      <NextIntlClientProvider messages={messages}>
        <body className="flex min-h-svh flex-col">
          <ScrollToTop />
          <Header productLinks={categoriesData.data} />
          <main className="flex-1">{children}</main>
          <Footer productLinks={categoriesData.data} />
          <Toaster />
        </body>
      </NextIntlClientProvider>
    </html>
  )
}
