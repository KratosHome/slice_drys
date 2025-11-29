import type { MetadataRoute } from "next";

import { locales } from "@/data/locales";

import { getCategoryUrls } from "@/server/categories/get-category-urls.server";
import { getProductsUrls } from "@/server/products/get-products-urls.server";
import { getPostsUrls } from "@/server/posts/get-ports-urls.server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE_URL: string | undefined = process.env.NEXT_URL;

  const [categoriesData, productsData, postsData] = await Promise.all([
    getCategoryUrls(),
    getProductsUrls(),
    getPostsUrls(),
  ]);

  const homePage = locales.map((lang) => ({
    url: `${SITE_URL}/${lang}`,
    lastModified: new Date("2024-03-01"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const privacyPolicy = locales.map((lang) => ({
    url: `${SITE_URL}/${lang}/privacy-policy`,
    lastModified: new Date("2024-03-01"),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const publicOffer = locales.map((lang) => ({
    url: `${SITE_URL}/${lang}/public-offer`,
    lastModified: new Date("2024-03-01"),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  const blog = locales.map((lang) => ({
    url: `${SITE_URL}/${lang}/blog`,
    lastModified: new Date("2024-03-01"),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const postsUrls = postsData.data.flatMap((post: { slug: string }) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}/blog/${post.slug}`,
      lastModified: new Date("2024-03-01"),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  );

  const categoriesUrls = categoriesData.data.flatMap(
    (category: { slug: string }) =>
      locales.map((lang) => ({
        url: `${SITE_URL}/${lang}/${category.slug}`,
        lastModified: new Date("2024-03-01"),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  );

  const productsUrls = productsData.data.flatMap(
    (product: { slug: string; categories?: Array<{ slug: string }> }) =>
      (product.categories ?? []).flatMap((category) =>
        locales.map((lang) => ({
          url: `${SITE_URL}/${lang}/${category.slug}/${product.slug}`,
          lastModified: new Date("2024-03-01"),
          changeFrequency: "weekly" as const,
          priority: 0.5,
        })),
      ),
  );

  return [
    ...homePage,
    ...blog,
    ...categoriesUrls,
    ...productsUrls,
    ...postsUrls,
    ...privacyPolicy,
    ...publicOffer,
  ];
}
