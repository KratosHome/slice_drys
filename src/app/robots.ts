import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: [
          "/*?sort=*",
          "/*?new=*",
          "/*?filters=*",
          "/*?page=*",
          "/*?categories=*",
          "/*?minWeight=*",
          "/*?maxWeight=*",
        ],
        allow: [
          "/",
          "/uk/",
          "/en/",
          "/uk/*",
          "/en/*",
          "/*/privacy-policy/",
          "/*/public-offer/",
          "/*/blog/",
          "/*/blog/*",
        ],
      },
    ],
    sitemap: "https://codecraftmaster.com/sitemap.xml",
  };
}
