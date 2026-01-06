import { MetadataRoute } from 'next'
import { SITE_URL } from '@/data/contacts'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: [
          '/*?sort=',
          '/*?filters=',
          '/*?categories=',
          '/*?minWeight=',
          '/*?maxWeight=',
          '/*?new=',
          '/*?page=',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
