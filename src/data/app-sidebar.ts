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
import type { AdminPermission } from '@/constants/user-role'

export interface AppSidebarItem {
  id: number
  name: string
  icon: LucideIcon
  link: string
  permission: AdminPermission
}

export const appSidebarData: AppSidebarItem[] = [
  {
    id: 1,
    name: 'Замовлення',
    icon: Home,
    link: 'admin/new',
    permission: 'orders:read',
  },
  {
    id: 2,
    name: 'Категорії',
    icon: Tag,
    link: 'admin/categories',
    permission: 'categories:manage',
  },
  {
    id: 3,
    name: 'Товари',
    icon: FolderKanban,
    link: 'admin/products',
    permission: 'products:manage',
  },
  {
    id: 4,
    name: 'Блог',
    icon: Rss,
    link: 'admin/blog',
    permission: 'blog:manage',
  },
  {
    id: 5,
    name: 'Блоки',
    icon: StickyNote,
    link: 'admin/block',
    permission: 'blocks:manage',
  },
  {
    id: 6,
    name: 'Користувачі',
    icon: CircleUser,
    link: 'admin/clients',
    permission: 'users:manage',
  },
  {
    id: 7,
    name: 'Статистика',
    icon: TrendingUp,
    link: 'admin/statistics',
    permission: 'statistics:read',
  },
]
