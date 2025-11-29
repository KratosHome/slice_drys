import type { ReactNode } from "react";

import { AppSidebar } from "@/components/admin/app-sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import SessionProvider from "@/components/admin/session-provider/session-provider";
import Login from "@/components/admin/login/login";

interface IAdminLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: LanguageType }>;
}

export const metadata = {
  title: "Адмін Панель",
  description: "Адмін панель сайту. Сторінка недоступна для пошукових систем.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout(props: IAdminLayoutProps) {
  const { children } = props;
  const session = await getServerSession();

  return (
    <div className="mx-auto max-w-[1248px]">
      <SessionProvider session={session}>
        <SidebarProvider>
          {!session || !session.user ? (
            <main className="w-full">
              <Login />
            </main>
          ) : (
            <>
              <AppSidebar />
              <main className="w-full">
                <SidebarTrigger />
                {children}
              </main>
            </>
          )}
        </SidebarProvider>
      </SessionProvider>
    </div>
  );
}
