import { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/contacts'
import { locales } from '@/data/locales'

const siteUrl = SITE_URL.replace(/\/+$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api',
        ...locales.map((locale) => `/${locale}/admin`),
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
