import {
  Home,
  Tag,
  Rss,
  StickyNote,
  CircleUser,
  FolderKanban,
  TrendingUp,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface AppSidebarItem {
  id: number
  name: string
  icon: LucideIcon
  link: string
  superAdminOnly?: boolean
}

export const appSidebarData: AppSidebarItem[] = [
  {
    id: 1,
    name: 'Замовлення',
    icon: Home,
    link: 'admin/new',
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
    name: 'Блоки',
    icon: StickyNote,
    link: 'admin/block',
  },
  {
    id: 6,
    name: 'Користувачі',
    icon: CircleUser,
    link: 'admin/clients',
    superAdminOnly: true,
  },
  {
    id: 7,
    name: 'Статистика',
    icon: TrendingUp,
    link: 'admin/statistics',
  },
]
