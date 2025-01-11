const headerLinksUk = [
  { id: 1, name: 'М’ясо', href: '/uk/products/meat' },
  { id: 2, name: 'Фрукти', href: '/uk/products/fruits' },
  { id: 3, name: 'Овочі', href: '/uk/products/vegetables' },
  { id: 4, name: 'Мікси', href: '/uk/products/mix' },
]

const headerLinksEn = [
  { id: 1, name: 'Meat', href: '/en/products/meat' },
  { id: 2, name: 'Fruit', href: '/en/products/fruits' },
  { id: 3, name: 'Veggie', href: '/en/products/vegetables' },
  { id: 4, name: 'Mix', href: '/en/products/mix' },
]

const hamburgerLinksOtherUk = [
  { id: 1, name: 'Блог', href: 'blog' },
  { id: 2, name: 'Опт', href: 'opt' },
  { id: 3, name: 'Контакти', href: 'kontakty' },
  { id: 4, name: 'Доставка', href: 'dostavka' },
]

export const headerLinks = {
  en: headerLinksEn,
  uk: headerLinksUk,
}

export const hamburgerLinksOther = {
  en: hamburgerLinksOtherUk,
  uk: hamburgerLinksOtherUk,
}
