import {
  Home,
  Tag,
  Rss,
  StickyNote,
  CircleUser,
  FolderKanban,
  TrendingUp,
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
    name: 'Категорії',
    icon: Tag, // Актуальна іконка для категорій
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
    name: 'Блоки',
    icon: StickyNote,
    link: 'admin/blocks',
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
