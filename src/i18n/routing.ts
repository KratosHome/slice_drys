import { defineRouting } from 'next-intl/routing'
import { locales } from '@/data/locales'

export const routing = defineRouting({
  locales,
  defaultLocale: 'uk',
})
