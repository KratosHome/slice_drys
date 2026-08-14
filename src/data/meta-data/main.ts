import type { Metadata } from 'next'
import { SITE_URL } from '@/data/contacts'

const mainMetaDataUk: Metadata = {
  title: "Сушені снеки з м'яса, фруктів та овочів | Slice & Dry's",
  description:
    "Натуральні сушені снеки з м'яса, фруктів та овочів без консервантів. Замовляйте корисні перекуси для подорожей, спорту й відпочинку зі швидкою доставкою.",
  keywords: [
    'сушені снеки',
    "м'ясні снеки",
    'сушені овочі',
    'сушені фрукти',
    'здоровий перекус',
    'натуральні снеки',
    'закуски до пива',
    'перекус в дорогу',
    'снеки для спорту',
  ],
  openGraph: {
    title: "Сушені снеки з м'яса, фруктів та овочів | Slice & Dry's",
    description:
      "Насолоджуйтеся сушеними снеками з м'яса, овочів і фруктів найвищої якості. Ідеальні для подорожей, спорту та перекусів. Натурально і без консервантів.",
    url: `${SITE_URL}/uk`,
    siteName: "Slice & Dry's",
    images: [
      {
        url: `${SITE_URL}/main.webp`,
        width: 1005,
        height: 895,
        alt: "Сушені снеки з м'яса, овочів та фруктів",
      },
    ],
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Сушені снеки з м'яса, фруктів та овочів | Slice & Dry's",
    description:
      "Спробуйте найсмачніші сушені снеки з м'яса, овочів і фруктів. Без консервантів, натурально та ідеально для активного способу життя.",
    images: [`${SITE_URL}/main.webp`],
    site: '@slicendrys',
  },
  alternates: {
    canonical: `${SITE_URL}/uk`,
    languages: {
      en: `${SITE_URL}/en`,
      uk: `${SITE_URL}/uk`,
      'x-default': `${SITE_URL}/uk`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

const mainMetaDataEn: Metadata = {
  title: "Dried Meat, Fruit & Vegetable Snacks | Slice & Dry's",
  description:
    'Natural dried meat, fruit and vegetable snacks without preservatives. Order healthy snacks for travel, sports and everyday breaks with delivery across Ukraine.',
  keywords: [
    'dried snacks',
    'meat snacks',
    'dried vegetables',
    'dried fruits',
    'healthy snack',
    'natural snacks',
    'beer snacks',
    'snack on the go',
    'sports snacks',
  ],
  openGraph: {
    title: "Dried Meat, Fruit & Vegetable Snacks | Slice & Dry's",
    description:
      'Enjoy high-quality dried snacks made from meat, vegetables, and fruits. Perfect for travel, sports, and snacking. Natural and preservative-free.',
    url: `${SITE_URL}/en`,
    siteName: "Slice & Dry's",
    images: [
      {
        url: `${SITE_URL}/main.webp`,
        width: 1005,
        height: 895,
        alt: 'Dried snacks made from meat, vegetables, and fruits',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dried Meat, Fruit & Vegetable Snacks | Slice & Dry's",
    description:
      'Try the tastiest dried snacks made from meat, vegetables, and fruits. Preservative-free, natural, and perfect for an active lifestyle.',
    images: [`${SITE_URL}/main.webp`],
    site: '@slicendrys',
  },
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      en: `${SITE_URL}/en`,
      uk: `${SITE_URL}/uk`,
      'x-default': `${SITE_URL}/uk`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const mainMetaData = {
  uk: mainMetaDataUk,
  en: mainMetaDataEn,
}
