import type { Metadata } from 'next'
import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Poppins } from 'next/font/google'
import Header from '@/components/header/header'
import { hamburgerLinksOther, headerLinks } from '@/data/header-links'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: LanguageType }
}) {
  const messages = await getMessages()
  const headerLinksData = headerLinks[locale]
  const hamburgerLinksOtherData = hamburgerLinksOther[locale]

  return (
    <html lang={locale} className={`${poppins.variable}`}>
      <body>
        <div className="mx-auto max-w-[1440px]">
          <NextIntlClientProvider messages={messages}>
            <Header
              headerLinks={headerLinksData}
              hamburgerLinksOther={hamburgerLinksOtherData}
            />
            {children}
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  )
}
