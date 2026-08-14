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

import {
  mixSubImages,
  fruitSubImages,
  meatSubImages,
  veggieSubImages,
  actionSubImages,
} from './hero-products-animation'

const slidersUk = [
  {
    slug: 'meat',
    title: "М'ясні джерки",
    image: '/slider/meat.webp',
    subImages: meatSubImages,
    color: colorConstants.red,
  },
  {
    slug: 'fruits',
    title: 'Фруктові джерки',
    image: '/slider/fruit.webp',
    subImages: fruitSubImages,
    color: colorConstants.orange,
  },
  {
    slug: 'vegetables',
    title: 'Овочеві джерки',
    image: '/slider/veggie.webp',
    subImages: veggieSubImages,
    color: colorConstants.green,
  },
  {
    slug: 'mixes',
    title: 'Мікс джерків',
    subImages: mixSubImages,
    image: '/slider/mix.webp',
    color: colorConstants.purple,
  },
  {
    slug: 'promotions',
    title: 'Акційна пропозиція',
    image: '/slider/promo.webp',
    subImages: actionSubImages,
    color: colorConstants.red,
  },
] as const

const slidersEn = [
  {
    slug: 'meat',
    title: 'Meat drys',
    image: '/slider/meat.webp',
    subImages: meatSubImages,
    color: colorConstants.red,
  },
  {
    slug: 'fruits',
    title: 'Fruit drys',
    image: '/slider/fruit.webp',
    subImages: fruitSubImages,
    color: colorConstants.orange,
  },
  {
    slug: 'vegetables',
    title: 'Veggie drys',
    image: '/slider/veggie.webp',
    subImages: veggieSubImages,
    color: colorConstants.green,
  },
  {
    slug: 'mixes',
    title: 'Mixed drys',
    image: '/slider/mix.webp',
    subImages: mixSubImages,
    color: colorConstants.purple,
  },
  {
    slug: 'promotions',
    title: 'Special offer',
    image: '/slider/promo.webp',
    subImages: actionSubImages,
    color: colorConstants.red,
  },
] as const

export const sliders = {
  uk: slidersUk,
  en: slidersEn,
}
