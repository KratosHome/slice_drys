const pageLinksUk = [
  { id: 1, name: 'Головна', href: '' },
  { id: 2, name: 'Блог', href: 'blog' },
  { id: 3, name: 'Опт', href: 'wholesale' },
  { id: 4, name: 'Контакти', href: 'contacts' },
  { id: 5, name: 'Доставка', href: 'delivery' },
]

const pageLinksEn = [
  { id: 1, name: 'Home', href: '' },
  { id: 2, name: 'Blog', href: 'blog' },
  { id: 3, name: 'Wholesale', href: 'wholesale' },
  { id: 4, name: 'Contacts', href: 'contacts' },
  { id: 5, name: 'Delivery', href: 'delivery' },
]

export const pageLinks = {
  en: pageLinksEn,
  uk: pageLinksUk,
}

const productLinksUk = [
  { id: 1, name: 'М’ясо', href: 'products/meat' },
  { id: 2, name: 'Фрукти', href: 'products/fruits' },
  { id: 3, name: 'Овочі', href: 'products/vegetables' },
  { id: 4, name: 'Мікси', href: 'products/mix' },
  { id: 5, name: 'Акція', href: 'products/promo' },
]

const productLinksEn = [
  { id: 1, name: 'Meat', href: 'products/meat' },
  { id: 2, name: 'Fruits', href: 'products/fruits' },
  { id: 3, name: 'Vegetables', href: 'products/vegetables' },
  { id: 4, name: 'Mixes', href: 'products/mix' },
  { id: 5, name: 'Promo', href: 'products/promo' },
]

export const productLinks = {
  en: productLinksEn,
  uk: productLinksUk,
}
