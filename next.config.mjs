/** @type {import('next').NextConfig} */

import createNextIntlPlugin from 'next-intl/plugin'
import * as NextMdx from '@next/mdx'

const withNextIntl = createNextIntlPlugin()

const withMDX = NextMdx.default({
  extension: /\.mdx?$/,
})

const nextConfig = {
  images: {
    formats: ['image/webp'],
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
  env: {
    NEXT_URL: process.env.NEXT_URL,
    NEXT_STATUS: process.env.NEXT_STATUS,
    NEXT_MONGO_DB: process.env.NEXT_MONGO_DB,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_BOT_CHAT_ID: process.env.TELEGRAM_BOT_CHAT_ID,
    NEXT_ADMIN_PASS: process.env.NEXT_ADMIN_PASS,
    NEXT_ADMIN_LOGIN: process.env.NEXT_ADMIN_LOGIN,
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
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app; style-src 'self' 'unsafe-inline'; img-src * blob: data:; connect-src *; font-src 'self'; frame-src 'self'",
          },
        ],
      },
    ]
  },
}

export default withNextIntl(withMDX(nextConfig))
