const colorConstants = {
  white: '#FBFBFB',
  black: '#0F0F0F',
  red: '#A90909',
  light_gray: '#E4E4E4',
  mid_gray: '#9B9B9B',
  dark_gray: '#7d7d7d',
  orange: '#ec9006',
  purple: '#b7006e',
  green: '#07c70d',
} as const

const slidersUk = [
  {
    slug: 'meat',
    title: "М'ясні джерки",
    image: '/slider/meat.webp',
    color: colorConstants.red,
  },
  {
    slug: 'fruits',
    title: 'Фруктові джерки',
    image: '/slider/fruit.webp',
    color: colorConstants.orange,
  },
  {
    slug: 'vegetables',
    title: 'Овочеві джерки',
    image: '/slider/veggie.webp',
    color: colorConstants.green,
  },
  {
    slug: 'mixes',
    title: 'Мікс джерків',
    image: '/slider/mix.webp',
    color: colorConstants.purple,
  },
  {
    slug: 'promotions',
    title: 'Акційна пропозиція',
    image: '/slider/promo.webp',
    color: colorConstants.red,
  },
] as const

const slidersEn = [
  {
    slug: 'meat',
    title: 'Meat drys',
    image: '/slider/meat.webp',
    color: colorConstants.red,
  },
  {
    slug: 'fruits',
    title: 'Fruit drys',
    image: '/slider/fruit.webp',
    color: colorConstants.orange,
  },
  {
    slug: 'vegetables',
    title: 'Veggie drys',
    image: '/slider/veggie.webp',
    color: colorConstants.green,
  },
  {
    slug: 'mixes',
    title: 'Mixed drys',
    image: '/slider/mix.webp',
    color: colorConstants.purple,
  },
  {
    slug: 'promotions',
    title: 'Special offer',
    image: '/slider/promo.webp',
    color: colorConstants.red,
  },
] as const

export const sliders = {
  uk: slidersUk,
  en: slidersEn,
}

export type HeroSlideSlug = (typeof slidersUk)[number]['slug']
