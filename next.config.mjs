/** @type {import('next').NextConfig} */

import createNextIntlPlugin from 'next-intl/plugin'
import * as NextMdx from '@next/mdx'

const withNextIntl = createNextIntlPlugin()

const withMDX = NextMdx.default({
  extension: /\.mdx?$/,
})

const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: '**.fbcdn.net',
      },
      {
        protocol: 'https',
        hostname: '**.instagram.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app www.googletagmanager.com www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src * blob: data:; connect-src * www.google-analytics.com; font-src 'self'; frame-src 'self' www.googletagmanager.com",
          },
        ],
      },
    ]
  },
}

export default withNextIntl(withMDX(nextConfig))
