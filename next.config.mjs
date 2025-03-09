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
}

export default withNextIntl(withMDX(nextConfig))
