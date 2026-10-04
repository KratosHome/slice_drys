import type { ReactNode } from 'react'
import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import { getMessages } from 'next-intl/server'

type MessageNamespace = keyof typeof import('../../local/en.json')

export function pickMessages(
  messages: AbstractIntlMessages,
  namespaces: readonly MessageNamespace[],
): AbstractIntlMessages {
  return Object.fromEntries(namespaces.map((key) => [key, messages[key]]))
}

/** Route-specific messages stay with the interactive component that uses them. */
export default async function ClientMessages({
  namespaces,
  children,
}: {
  namespaces: readonly MessageNamespace[]
  children: ReactNode
}) {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={pickMessages(messages, namespaces)}>
      {children}
    </NextIntlClientProvider>
  )
}
