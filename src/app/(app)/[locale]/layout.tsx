import type { ReactNode } from "react";

import { fetchTags } from "@/data/fetch-tags";

import Header from "@/components/client/header";
import Footer from "@/components/client/footer";
import NotFoundPage from "@/components/not-found";
import ScrollToTop from "@/components/client/scroll-to-top";
import Toaster from "@/components/ui/toaster";
import ThemeProvider from "@/components/providers/theme-provider";
import GoogleAnalytics from "@/components/google-analytics";
import { Analytics } from "@vercel/analytics/react";

import { Rubik_Doodle_Shadow, Montserrat } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { seedCategories } from "@/server/seed/category.server";
import { routing } from "@/i18n/routing";

import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800"],
});

const rubikDoodleShadow = Rubik_Doodle_Shadow({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rubik-doodle-shadow",
  weight: ["400"],
});

interface ILocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: LanguageType }>;
}

export default async function LocaleLayout(props: ILocaleLayoutProps) {
  const SITE_URL: string | undefined = process.env.NEXT_URL;

  const params = await props.params;

  const { locale } = params;
  const { children } = props;

  if (!hasLocale(routing.locales, locale)) {
    return (
      <html>
        <body>
          <NotFoundPage />
        </body>
      </html>
    );
  }

  const messages = await getMessages();

  await seedCategories();

  const categoriesData: IResult<ICategory> = await fetch(
    `${SITE_URL}/api/categories`,
    {
      cache: "force-cache",
      next: { tags: [`${fetchTags.menu}`] },
    },
  ).then((res) => res.json());

  return (
    <html
      suppressHydrationWarning
      lang={locale}
      className={`${montserrat.className} ${rubikDoodleShadow.variable}`}
    >
      <head>
        <GoogleAnalytics />
      </head>
      <body className="flex min-h-svh flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <ScrollToTop />
            <Toaster />
            <Header productLinks={categoriesData.data} />
            <main className="flex-1">{children}</main>
            <Footer productLinks={categoriesData.data} />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
      <Analytics />
    </html>
  );
}
