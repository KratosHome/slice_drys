const pageLinksUk: ILink[] = [
  { id: 1, name: 'Головна', href: '' },
  { id: 2, name: 'Блог', href: 'blog' },
  { id: 4, name: 'Контакти', href: 'contacts' },
  { id: 5, name: 'Опт', href: 'wholesale' },
]

const pageLinksEn: ILink[] = [
  { id: 1, name: 'Home', href: '' },
  { id: 2, name: 'Blog', href: 'blog' },
  { id: 4, name: 'Contacts', href: 'contacts' },
  { id: 5, name: 'Wholesale', href: 'wholesale' },
]

export const pageLinks = {
  en: pageLinksEn,
  uk: pageLinksUk,
}
