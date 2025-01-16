import { colorConstants } from '../../tailwind.config'

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

const meatSubImages = [
  {
    path: '/sliders/meat/meat-left-bottom-1.png',
    x: -490,
    y: 160,
    width: 52,
    height: 52,
  },
  {
    path: '/sliders/meat/meat-left-bottom-2.png',
    x: -560,
    y: 230,
    width: 67,
    height: 64,
  },
  {
    path: '/sliders/meat/meat-left-bottom-3.png',
    x: -630,
    y: 70,
    width: 113,
    height: 102,
  },
  {
    path: '/sliders/meat/meat-left-top-1.png',
    x: -610,
    y: -340,
    width: 32,
    height: 32,
  },
  {
    path: '/sliders/meat/meat-left-top-2.png',
    x: -650,
    y: -610,
    width: 66,
    height: 62,
  },
  {
    path: '/sliders/meat/meat-right-bottom-1.png',
    x: 490,
    y: 230,
    width: 78,
    height: 74,
  },
  {
    path: '/sliders/meat/meat-right-bottom-2.png',
    x: 610,
    y: -100,
    width: 22,
    height: 25,
  },
  {
    path: '/sliders/meat/meat-right-bottom-3.png',
    x: 670,
    y: -230,
    width: 24,
    height: 95,
  },
  {
    path: '/sliders/meat/meat-right-bottom-4.png',
    x: 640,
    y: -155,
    width: 71,
    height: 63,
  },
  {
    path: '/sliders/meat/meat-right-bottom-5.png',
    x: 610,
    y: 300,
    width: 85,
    height: 88,
  },
  {
    path: '/sliders/meat/meat-right-top-1.png',
    x: 670,
    y: -665,
    width: 42,
    height: 92,
  },
  {
    path: '/sliders/meat/meat-right-top-2.png',
    x: 600,
    y: -450,
    width: 32,
    height: 30,
  },
  {
    path: '/sliders/meat/meat-right-top-3.png',
    x: 540,
    y: -530,
    width: 64,
    height: 63,
  },
]

const fruitSubImages = [
  {
    path: '/sliders/fruit/fruit-left-bottom-1.png',
    x: -620,
    y: -100,
    width: 88,
    height: 90,
  },
  {
    path: '/sliders/fruit/fruit-left-bottom-2.png',
    x: -540,
    y: 230,
    width: 66,
    height: 61,
  },
  {
    path: '/sliders/fruit/fruit-left-bottom-3.png',
    x: -650,
    y: 300,
    width: 55,
    height: 55,
  },
  {
    path: '/sliders/fruit/fruit-left-top-1.png',
    x: -660,
    y: -610,
    width: 53,
    height: 87,
  },
  {
    path: '/sliders/fruit/fruit-left-top-2.png',
    x: -610,
    y: -340,
    width: 36,
    height: 40,
  },
  {
    path: '/sliders/fruit/fruit-right-bottom-1.png',
    x: 610,
    y: 300,
    width: 86,
    height: 68,
  },
  {
    path: '/sliders/fruit/fruit-right-bottom-2.png',
    x: 670,
    y: -230,
    width: 39,
    height: 82,
  },
  {
    path: '/sliders/fruit/fruit-right-bottom-3.png',
    x: 640,
    y: -155,
    width: 56,
    height: 56,
  },
  {
    path: '/sliders/fruit/fruit-right-bottom-4.png',
    x: 475,
    y: 230,
    width: 60,
    height: 55,
  },
  {
    path: '/sliders/fruit/fruit-right-bottom-5.png',
    x: 610,
    y: -50,
    width: 59,
    height: 55,
  },
  {
    path: '/sliders/fruit/fruit-right-top-1.png',
    x: 670,
    y: -665,
    width: 49,
    height: 48,
  },
  {
    path: '/sliders/fruit/fruit-right-top-2.png',

    width: 49,
    height: 92,
  },
  {
    path: '/sliders/fruit/fruit-right-top-3.png',
    x: 540,
    y: -530,
    width: 75,
    height: 66,
  },
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
