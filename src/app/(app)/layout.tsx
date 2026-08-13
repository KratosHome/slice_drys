import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SITE_URL } from '@/data/contacts'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Slice & Dry's",
  authors: [{ name: "Slice & Dry's", url: SITE_URL }],
  creator: "Slice & Dry's",
  publisher: "Slice & Dry's",
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
}

interface IRootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: IRootLayoutProps) {
  return <>{children}</>
}
