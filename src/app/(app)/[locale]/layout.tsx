import type { ReactNode } from 'react'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Rubik_Doodle_Shadow, Montserrat } from 'next/font/google'

import Header from '@/components/client/header'

import '../globals.css'
import { routing } from '@/i18n/routing'
import NotFoundPage from '@/components/not-found'
import { GoogleTagManager } from '@/components/client/google-tag-manager/google-tag-manager'
import { fetchTags } from '@/data/fetch-tags'
import dynamic from 'next/dynamic'
import { Loader } from 'lucide-react'
import ClientDynamicMain from '@/components/client/dynamic-imports/min'

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

const url = process.env.NEXT_URL

export default async function LocaleLayout(props: {
  children: ReactNode
  params: Promise<{ locale: LanguageType }>
}) {
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

  const categoriesData = await fetch(`${url}/api/categories`, {
    cache: 'force-cache',
    next: { tags: [`${fetchTags.menu}`] },
  }).then((res) => res.json())

  return (
    <html
      lang={locale}
      className={`${montserrat.className} ${rubikDoodleShadow.variable} dark`}
    >
      <GoogleTagManager />
      <body className="flex min-h-svh flex-col">
        <NextIntlClientProvider messages={messages}>
          <ClientDynamicMain />
          <Header productLinks={categoriesData.data} />
          <main className="flex-1">{children}</main>
          <Footer productLinks={categoriesData.data} />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
