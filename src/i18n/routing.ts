import { defineRouting } from 'next-intl/routing'
import { locales } from '@/data/locales'

export const routing = defineRouting({
  locales,
  defaultLocale: 'uk',
  localePrefix: 'always',
  // Per-page metadata owns hreflang so x-default stays /uk consistently in
  // HTML and sitemap instead of conflicting with next-intl's unprefixed URL.
  alternateLinks: false,
})
