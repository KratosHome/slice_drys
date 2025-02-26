import {
  Home,
  Tag,
  Rss,
  StickyNote,
  CircleUser,
  FolderKanban,
  TrendingUp,
  UtensilsCrossed,
} from 'lucide-react'

export const appSidebarData = [
  {
    id: 1,
    name: 'Замовлення',
    icon: Home,
    link: 'admin/new',
  },
  {
    id: 2,
    name: 'Меню',
    icon: UtensilsCrossed,
    link: 'admin/menu',
  },
  {
    id: 2,
    name: 'Категорії',
    icon: Tag,
    link: 'admin/categories',
  },
  {
    id: 3,
    name: 'Товари',
    icon: FolderKanban,
    link: 'admin/products',
  },
  {
    id: 4,
    name: 'Блог',
    icon: Rss,
    link: 'admin/blog',
  },
  {
    id: 5,
    name: 'Сторінки',
    icon: StickyNote,
    link: 'admin/pages',
  },
  {
    id: 6,
    name: 'Клієнти',
    icon: CircleUser,
    link: 'admin/clients',
  },
  {
    id: 7,
    name: 'Статистика',
    icon: TrendingUp,
    link: 'admin/statistics',
  },
]
