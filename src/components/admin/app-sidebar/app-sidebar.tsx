'use client'

import { appSidebarData } from '@/data/app-sidebar'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

import { useLocale } from 'next-intl'
import { TransitionLink } from '@/components/client/transition-link'

interface AppSidebarProps {
  canManageUsers: boolean
}

export function AppSidebar({ canManageUsers }: AppSidebarProps) {
  const locale: string = useLocale()
  const visibleItems = appSidebarData.filter(
    (item) => !item.superAdminOnly || canManageUsers,
  )

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-[200px]">
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <TransitionLink href={`/${locale}/${item.link}`}>
                      <item.icon />

                      <span>{item.name}</span>
                    </TransitionLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
