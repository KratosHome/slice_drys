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

const sliderLinksUk = [
  { name: 'М’ЯСО', link: '/uk/meat' },
  { name: 'ФРУКТИ', link: '/uk/fruits' },
  { name: 'ОВОЧІ', link: '/uk/vegetables' },
  { name: 'МІКСИ', link: '/uk/mix' },
  { name: 'АКЦІЯ', link: '/uk/promo' },
]

const sliderLinksEn = [
  { name: 'Meat', link: '/en/meat' },
  { name: 'Fruit', link: '/en/fruits' },
  { name: 'Veggie', link: '/en/vegetables' },
  { name: 'Mix', link: '/en/mix' },
  { name: 'Promo', link: '/en/promo' },
]

const slidersUk = [
  {
    title: "М'ясні сушені",
    image: '/sliders/meat.png',
    color: colorConstants.red,
  },
  {
    title: 'Фруктові сушені',
    image: '/sliders/fruit.png',
    color: colorConstants.orange,
  },
  {
    title: 'Овочеві сушені',
    image: '/sliders/veggie.png',
    color: colorConstants.green,
  },
  {
    title: 'Мікс сушені',
    image: '/sliders/mix.png',
    color: colorConstants.purple,
  },
  {
    title: 'Акційна пропозиція',
    image: '/sliders/promo.png',
    color: colorConstants.red,
  },
]

const slidersEn = [
  {
    title: 'Meat drys',
    image: '/sliders/meat.png',
    color: colorConstants.red,
  },
  {
    title: 'Fruit drys',
    image: '/sliders/fruit.png',
    color: colorConstants.orange,
  },
  {
    title: 'Veggie drys',
    image: '/sliders/veggie.png',
    color: colorConstants.green,
  },
  {
    title: 'Mixed drys',
    image: '/sliders/mix.png',
    color: colorConstants.purple,
  },
  {
    title: 'Special offer',
    image: '/sliders/promo.png',
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
