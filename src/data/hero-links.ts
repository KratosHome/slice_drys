import { colorConstants } from '../../tailwind.config'

const sliderLinksUk = [
  { name: 'М’ЯСО', link: '/uk/products/meat' },
  { name: 'ФРУКТИ', link: '/uk/products/fruits' },
  { name: 'ОВОЧІ', link: '/uk/products/vegetables' },
  { name: 'МІКСИ', link: '/uk/products/mix' },
  { name: 'АКЦІЯ', link: '/uk/products/promo' },
]

const sliderLinksEn = [
  { name: 'Meat', link: '/en/products/meat' },
  { name: 'Fruit', link: '/en/products/fruits' },
  { name: 'Veggie', link: '/en/products/vegetables' },
  { name: 'Mix', link: '/en/products/mix' },
  { name: 'Promo', link: '/en/products/promo' },
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
