import { Suspense, type ReactNode } from 'react'

import Header from '@/components/client/header'
import Footer from '@/components/client/footer'
import ScrollToTop from '@/components/client/scroll-to-top'
import Toaster from '@/components/ui/toaster'
import ThemeProvider from '@/components/providers/theme-provider'
import GoogleAnalytics from '@/components/google-analytics'
import { Analytics } from '@vercel/analytics/react'

import { Rubik_Doodle_Shadow, Montserrat } from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { routing } from '@/i18n/routing'

import '../globals.css'
import SaveReferral from '@/components/client/save-referral'
import PageTransition from '@/components/client/page-transition'
import { getPublicCategories } from '@/server/public-data-cache.server'

export const revalidate = 86400

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
})

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-rubik-doodle-shadow',
  weight: ['400'],
})

interface ILocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout(props: ILocaleLayoutProps) {
  const params = await props.params

  const { locale } = params
  const { children } = props

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const [messages, categoriesData] = await Promise.all([
    getMessages(),
    getPublicCategories(),
  ])
  const productLinks: IPublicCategoryLink[] = categoriesData.data.map(
    ({ slug, name }) => ({ slug, name }),
  )

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${montserrat.className} ${rubikDoodleShadow.variable}`}
    >
      <head>
        <GoogleAnalytics />
      </head>
      <body suppressHydrationWarning className="flex min-h-svh flex-col">
        <Suspense fallback={null}>
          <PageTransition locale={locale} />
        </Suspense>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <ScrollToTop />
            <Toaster />
            <Header productLinks={productLinks} />
            <main className="flex-1">{children}</main>
            <Footer productLinks={productLinks} />
            <SaveReferral />
            <Analytics />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
