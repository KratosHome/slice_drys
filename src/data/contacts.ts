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

export const SITE_URL = process.env.NEXT_URL ?? 'https://slicedrys.com'
