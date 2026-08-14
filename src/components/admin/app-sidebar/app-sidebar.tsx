'use client'

import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'

import LogOut from '@/components/admin/log-out/log-out'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { TransitionLink } from '@/components/client/transition-link'
import { ORDER_STATUS_SLUGS } from '@/constants/order-status'
import { hasAdminPermission, type AdminRole } from '@/constants/user-role'
import { appSidebarData, type AppSidebarItem } from '@/data/app-sidebar'

interface AppSidebarProps {
  role: AdminRole
}

function isItemActive(
  item: AppSidebarItem,
  pathname: string,
  locale: string,
): boolean {
  if (item.permission === 'orders:read') {
    return ORDER_STATUS_SLUGS.some(
      (status) => pathname === `/${locale}/admin/${status}`,
    )
  }

  return pathname === `/${locale}/${item.link}`
}

export function AppSidebar({ role }: AppSidebarProps) {
  const locale = useLocale()
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  const visibleItems = appSidebarData.filter((item) =>
    hasAdminPermission(role, item.permission),
  )

  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <nav aria-label="Навігація адмінпанелі">
              <SidebarMenu className="mt-12 md:mt-[200px]">
                {visibleItems.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isItemActive(item, pathname, locale)}
                      tooltip={item.name}
                    >
                      <TransitionLink
                        href={`/${locale}/${item.link}`}
                        aria-current={
                          isItemActive(item, pathname, locale)
                            ? 'page'
                            : undefined
                        }
                        onNavigate={closeMobileSidebar}
                      >
                        <item.icon />
                        <span>{item.name}</span>
                      </TransitionLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </nav>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <LogOut presentation="sidebar" onSignedOut={closeMobileSidebar} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
