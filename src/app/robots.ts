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
          '/*?page=',
        ],
      },
    ],
    sitemap: 'https://slicedrys.com/sitemap.xml',
  }
}
