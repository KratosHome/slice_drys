import { ReactNode } from 'react'
import { WebVitals } from '@/components/web-vitals'

type Props = {
  children: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <>
      <WebVitals />
      {children}
    </>
  )
}
