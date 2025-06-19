import type { ReactNode } from 'react'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Rubik_Doodle_Shadow, Montserrat } from 'next/font/google'

import Header from '@/components/client/header'

import '../globals.css'
import { routing } from '@/i18n/routing'
import NotFoundPage from '@/components/not-found'
import { GoogleAnalytics } from '@next/third-parties/google'
import { fetchTags } from '@/data/fetch-tags'
import dynamic from 'next/dynamic'
import { Loader } from 'lucide-react'
import ClientDynamicMain from '@/components/client/dynamic-imports/main'
import ThemeProvider from '@/components/providers/theme-provider'
import { Analytics } from '@vercel/analytics/react'

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

interface ILocaleLayoutProps {
  children: ReactNode
  params: Promise<{ locale: LanguageType }>
}

export default async function LocaleLayout(props: ILocaleLayoutProps) {
  const SITE_URL: string | undefined = process.env.NEXT_URL

  const params = await props.params

  const { locale } = params
  const { children } = props

  if (!hasLocale(routing.locales, locale)) {
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

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className={`${montserrat.className} ${rubikDoodleShadow.variable}`}
    >
      <body className="flex min-h-svh flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <ClientDynamicMain />
            <Header productLinks={categoriesData.data} />
            <main className="flex-1">{children}</main>
            <Footer productLinks={categoriesData.data} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-B0WJ3M87VD" />
      <Analytics />
    </html>
  )
}
