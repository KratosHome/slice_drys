import { MetadataRoute } from 'next'

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
        ],
        allow: [
          '/uk/',
          '/en/',
          '/uk/*',
          '/en/*',
          '/blog/',
          '/blog/*',
          '/uk/blog/',
          '/uk/blog/*',
          '/en/blog/',
          '/en/blog/*',
        ],
      },
    ],
    sitemap: 'https://slicedrys.com/sitemap.xml',
  }
}
