export const contacts = {
  facebook: 'https://www.facebook.com/slicedrys',
  instagram: 'https://www.instagram.com/slicedrys',
  phone: '+38 (093) 979 79 10',
  address: {
    en: 'Cherkasy city, Nadpilna St. 248A.',
    uk: 'м. Черкаси, вул. Надпільна 248А.',
  },
  mail: 'slicedrysend@gmail.com',
  time: '10:00 - 19:00',
} as const

const PRODUCTION_SITE_URL = 'https://slicedrys.com'
const configuredSiteUrl = process.env.NEXT_URL?.replace(/\/+$/, '')

const isLocalSiteUrl = (value?: string) => {
  if (!value) return false

  try {
    const hostname = new URL(value).hostname
    return hostname === 'localhost' || hostname === '127.0.0.1'
  } catch {
    return true
  }
}

export const SITE_URL =
  process.env.NODE_ENV === 'production' && isLocalSiteUrl(configuredSiteUrl)
    ? PRODUCTION_SITE_URL
    : (configuredSiteUrl ?? PRODUCTION_SITE_URL)
