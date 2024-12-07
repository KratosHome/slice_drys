import { colorConstants } from '../../../../tailwind.config'

export const sliderLinks = [
  { name: 'М’ЯСО', link: '/products/meat.tsx#product' },
  { name: 'ФРУКТИ', link: '/products/fruits' },
  { name: 'ОВОЧІ', link: '/products/vegetables' },
  { name: 'МІКСИ', link: '/products/mix' },
  { name: 'АКЦІЯ', link: '/products/promo' },
]

export const sliders = [
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
