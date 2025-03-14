export const colorConstants = {
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
    title: "М'ясні сушені",
    image: '/slider/meat.webp',
    subImages: meatSubImages,
    color: colorConstants.red,
  },
  {
    title: 'Фруктові сушені',
    image: '/slider/fruit.webp',
    subImages: fruitSubImages,
    color: colorConstants.orange,
  },
  {
    title: 'Овочі сушені',
    image: '/slider/veggie.webp',
    subImages: veggieSubImages,
    color: colorConstants.green,
  },
  {
    title: 'Мікс сушені',
    subImages: mixSubImages,
    image: '/slider/mix.webp',
    color: colorConstants.purple,
  },
  {
    title: 'Акційна пропозиція',
    image: '/slider/promo.webp',
    subImages: actionSubImages,
    color: colorConstants.red,
  },
] as const

const slidersEn = [
  {
    title: 'Meat drys',
    image: '/slider/meat.webp',
    subImages: meatSubImages,
    color: colorConstants.red,
  },
  {
    title: 'Fruit drys',
    image: '/slider/fruit.webp',
    subImages: fruitSubImages,
    color: colorConstants.orange,
  },
  {
    title: 'Veggie drys',
    image: '/slider/veggie.webp',
    subImages: veggieSubImages,
    color: colorConstants.green,
  },
  {
    title: 'Mixed drys',
    image: '/slider/mix.webp',
    subImages: mixSubImages,
    color: colorConstants.purple,
  },
  {
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
