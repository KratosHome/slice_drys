import type { ReactNode } from "react";

interface IRootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: IRootLayoutProps) {
  return <>{children}</>;
}
