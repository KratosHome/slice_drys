/** @type {import('next').NextConfig} */

import createNextIntlPlugin from 'next-intl/plugin'
import * as NextMdx from '@next/mdx'
import { LEGACY_PUBLIC_PATHS } from './src/data/legacy-public-paths.mjs'

const withNextIntl = createNextIntlPlugin()

const withMDX = NextMdx.default({
  extension: /\.mdx?$/,
})

// ---------------------------------------------------------------------------
// Content Security Policy — explicit origin whitelists
// ---------------------------------------------------------------------------

const isDevelopment = process.env.NODE_ENV === 'development'

const scriptOrigins = [
  'https://www.googletagmanager.com',
  'https://va.vercel-scripts.com',
]

const connectOrigins = [
  'https://www.google-analytics.com',
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
  'https://www.googletagmanager.com',
  'https://res.cloudinary.com',
  'https://*.vercel-insights.com',
  'https://va.vercel-scripts.com',
  'https://vitals.vercel-insights.com',
]

const imageOrigins = [
  "'self'",
  'data:',
  'blob:',
  'https://www.googletagmanager.com',
  'https://res.cloudinary.com',
  'https://*.fbcdn.net',
  'https://*.instagram.com',
  'https://via.placeholder.com',
]

const fontOrigins = ["'self'", 'data:']

const styleOrigins = ["'self'", "'unsafe-inline'"]

const createContentSecurityPolicy = () => {
  const scriptSources = [
    "'self'",
    "'unsafe-inline'",
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
    ...scriptOrigins,
  ]

  return [
    "default-src 'self'",
    "base-uri 'self'",
    `script-src ${scriptSources.join(' ')}`,
    `style-src ${styleOrigins.join(' ')}`,
    `img-src ${imageOrigins.join(' ')}`,
    `connect-src 'self' ${connectOrigins.join(' ')}`,
    `font-src ${fontOrigins.join(' ')}`,
    "frame-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "child-src 'self' blob:",
    "worker-src 'self' blob:",
    "media-src 'self' blob:",
    ...(!isDevelopment ? ['upgrade-insecure-requests'] : []),
  ].join('; ')
}

// ---------------------------------------------------------------------------
// Security headers
// ---------------------------------------------------------------------------

const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
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
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Content-Security-Policy',
    value: createContentSecurityPolicy(),
  },
]

// ---------------------------------------------------------------------------
// Next.js config
// ---------------------------------------------------------------------------

const nextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['mongoose'],
  // Resolve historical URLs before removing their trailing slash, so they
  // reach the final page in one redirect. Keep slash removal for other URLs.
  skipTrailingSlashRedirect: true,
  async redirects() {
    const legacyRedirects = Object.entries(LEGACY_PUBLIC_PATHS).flatMap(
      ([slug, destination]) => [
        {
          source: `/${slug}`,
          destination: `/uk${destination}`,
          permanent: true,
        },
        ...['uk', 'en'].map((locale) => ({
          source: `/${locale}/${slug}`,
          destination: `/${locale}${destination}`,
          permanent: true,
        })),
      ],
    )

    return [
      ...legacyRedirects,
      { source: '/:path+/', destination: '/:path+', permanent: true },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 60, 70, 75],
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
        source: '/fonts/rubik-doodle-shadow/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default withNextIntl(withMDX(nextConfig))
