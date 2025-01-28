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

const sliderLinksUk = [
  { name: 'М’ЯСО', link: '/products/meat.tsx#product' },
  { name: 'ФРУКТИ', link: '/products/fruits' },
  { name: 'ОВОЧІ', link: '/products/vegetables' },
  { name: 'МІКСИ', link: '/products/mix' },
  { name: 'АКЦІЯ', link: '/products/promo' },
]

const sliderLinksEn = [
  { name: 'Meat', link: '/products/meat.tsx#product' },
  { name: 'Fruit', link: '/products/fruits' },
  { name: 'Veggie', link: '/products/vegetables' },
  { name: 'Mix', link: '/products/mix' },
  { name: 'Promo', link: '/products/promo' },
]

const slidersUk = [
  {
    title: "М'ясні сушені",
    image: '/sliders/meat.png',
    subImages: meatSubImages,
    color: colorConstants.red,
  },
  {
    title: 'Фруктові сушені',
    image: '/sliders/fruit.png',
    subImages: fruitSubImages,
    color: colorConstants.orange,
  },
  {
    title: 'Овочеві сушені',
    image: '/sliders/veggie.png',
    subImages: veggieSubImages,
    color: colorConstants.green,
  },
  {
    title: 'Мікс сушені',
    subImages: mixSubImages,
    image: '/sliders/mix.png',
    color: colorConstants.purple,
  },
  {
    title: 'Акційна пропозиція',
    image: '/sliders/promo.png',
    subImages: actionSubImages,
    color: colorConstants.red,
  },
]

const slidersEn = [
  {
    title: 'Meat drys',
    image: '/sliders/meat.png',
    subImages: meatSubImages,
    color: colorConstants.red,
  },
  {
    title: 'Fruit drys',
    image: '/sliders/fruit.png',
    subImages: fruitSubImages,
    color: colorConstants.orange,
  },
  {
    title: 'Veggie drys',
    image: '/sliders/veggie.png',
    subImages: veggieSubImages,
    color: colorConstants.green,
  },
  {
    title: 'Mixed drys',
    image: '/sliders/mix.png',
    subImages: mixSubImages,
    color: colorConstants.purple,
  },
  {
    title: 'Special offer',
    image: '/sliders/promo.png',
    subImages: actionSubImages,
    color: colorConstants.red,
  },
]

export const sliderLinks = {
  uk: sliderLinksUk,
  en: sliderLinksEn,
} as const

export const sliders = {
  uk: slidersUk,
  en: slidersEn,
} as const
