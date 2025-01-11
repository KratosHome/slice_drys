import type { Metadata } from 'next'
import '../globals.css'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Poppins } from 'next/font/google'
import { hamburgerLinksOther, headerLinks } from '@/data/header-links'
import Header from '@/components/client/header/header'

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: "Slice Dry's | Home",
  description: 'The best dried vegetables, fruit and meat',
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
  const hamburgerLinksOtherData = hamburgerLinksOther[locale]

  return (
    <html lang={locale} className={`${poppins.variable}`}>
      <NextIntlClientProvider messages={messages}>
        <body>
          <Header
            headerLinks={headerLinksData}
            hamburgerLinksOther={hamburgerLinksOtherData}
          />
          {children}
        </body>
      </NextIntlClientProvider>
    </html>
  )
}
