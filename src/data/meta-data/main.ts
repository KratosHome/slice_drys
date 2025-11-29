import type { Metadata } from "next";

const SITE_URL: string | undefined = process.env.NEXT_URL;

export const mainMetaDataUk: Metadata = {
  title:
    "Сушені снеки (м'ясо, фрукти, овочі) — Slice&Dry's | Найсмачніші закуски",
  description:
    "Сушені снеки з м'яса, овочів і фруктів. Ідеальні для перекусів під час подорожей, спорту та відпочинку. Slice&Dry's — натурально, без консервантів і надзвичайно смачно.",
  keywords: [
    "сушені снеки",
    "м'ясні снеки",
    "сушені овочі",
    "сушені фрукти",
    "здоровий перекус",
    "натуральні снеки",
    "закуски до пива",
    "перекус в дорогу",
    "снеки для спорту",
  ],
  openGraph: {
    title: "Сушені снеки (м'ясо, овочі, фрукти) — Slice&Dry's",
    description:
      "Насолоджуйтеся сушеними снеками з м'яса, овочів і фруктів найвищої якості. Ідеальні для подорожей, спорту та перекусів. Натурально і без консервантів.",
    url: `${SITE_URL}/uk`,
    siteName: "Slice&Dry's",
    images: [
      {
        url: `${SITE_URL}/main.webp`,
        width: 1200,
        height: 630,
        alt: "Сушені снеки з м'яса, овочів та фруктів",
      },
    ],
    locale: "uk_UA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Сушені снеки (м'ясо, овочі, фрукти) — Slice&Dry's",
    description:
      "Спробуйте найсмачніші сушені снеки з м'яса, овочів і фруктів. Без консервантів, натурально та ідеально для активного способу життя.",
    images: [`${SITE_URL}/main.webp`],
    site: "@slicendrys",
  },
  alternates: {
    canonical: `${SITE_URL}/uk`,
    languages: {
      en: `${SITE_URL}/en`,
      uk: `${SITE_URL}/uk`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const mainMetaDataEn: Metadata = {
  title:
    "Dried Snacks (Meat, Fruits, Vegetables) — Slice&Dry's | The Tastiest Snacks",
  description:
    "Dried snacks made from meat, vegetables, and fruits. Perfect for on-the-go snacking during travels, sports, and leisure. Slice&Dry's — natural, preservative-free, and incredibly tasty.",
  keywords: [
    "dried snacks",
    "meat snacks",
    "dried vegetables",
    "dried fruits",
    "healthy snack",
    "natural snacks",
    "beer snacks",
    "snack on the go",
    "sports snacks",
  ],
  openGraph: {
    title: "Dried Snacks (Meat, Vegetables, Fruits) — Slice&Dry's",
    description:
      "Enjoy high-quality dried snacks made from meat, vegetables, and fruits. Perfect for travel, sports, and snacking. Natural and preservative-free.",
    url: `${SITE_URL}/en`,
    siteName: "Slice&Dry's",
    images: [
      {
        url: `${SITE_URL}/main.webp`,
        width: 1200,
        height: 630,
        alt: "Dried snacks made from meat, vegetables, and fruits",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dried Snacks (Meat, Vegetables, Fruits) — Slice&Dry's",
    description:
      "Try the tastiest dried snacks made from meat, vegetables, and fruits. Preservative-free, natural, and perfect for an active lifestyle.",
    images: [`${SITE_URL}/main.webp`],
    site: "@slicendrys",
  },
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: {
      en: `${SITE_URL}/en`,
      uk: `${SITE_URL}/uk`,
    },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const mainMetaData = {
  uk: mainMetaDataUk,
  en: mainMetaDataEn,
};
