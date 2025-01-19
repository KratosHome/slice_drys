import type { Metadata } from 'next'
import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Poppins, Rubik_Doodle_Shadow } from 'next/font/google'
import { headerLinks } from '@/data/header-links'
import Header from '@/components/client/header/header'
import { Toaster } from '@/components/admin/ui/toaster'

const poppins = Poppins({
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

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: LanguageType }>
}) {
  const params = await props.params

  const { locale } = params
  const { children } = props

  const messages = await getMessages()
  const headerLinksData = headerLinks[locale]

  return (
    <html
      lang={locale}
      className={`${poppins.variable} ${rubikDoodleShadow.variable}`}
    >
      <NextIntlClientProvider messages={messages}>
        <body>
          <Header headerLinks={headerLinksData} />
          {children}
          <Toaster />
        </body>
      </NextIntlClientProvider>
    </html>
  )
}
