import { FC } from "react";

interface JsonLdProps {
  currentCategories: ICategory;
  locale: string;
  canonicalUrl: string;
  productsData: {
    data: IProduct[];
    currentPage: number;
    totalItems: number;
    totalPages: number;
  };
  categoriesParam: string;
}

const ProductListJsonLd: FC<JsonLdProps> = ({
  currentCategories,
  locale,
  canonicalUrl,
  productsData,
  categoriesParam,
}) => {
  const url = process.env.NEXT_URL;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: currentCategories.name[locale as ILocale],
    description: currentCategories?.metaDescription?.[locale as ILocale],
    url: canonicalUrl,
    image: currentCategories.image || `${url}/default-category-image.jpg`,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        uk: `${url}/uk/${categoriesParam}`,
        en: `${url}/en/${categoriesParam}`,
      },
    },
    products: productsData.data.map((product) => ({
      "@type": "Product",
      "@id": `${url}/${product.category}/${product.slug}`,
      name: product.name,
      image: product.img,
      description: product.description,
      brand: {
        "@type": "Brand",
        name: "Slice & Dry's",
      },
      sku: product._id,
      offers: product.variables.map((variable) => ({
        "@type": "Offer",
        url: `${url}/${product.category}/${product.slug}`,
        priceCurrency: "UAH",
        price: variable.price,
        itemCondition: "https://schema.org/NewCondition",
        availability: "https://schema.org/InStock",
      })),
    })),
    pagination: {
      prev:
        productsData.currentPage > 1
          ? `${url}/category/?page=${productsData.currentPage - 1}`
          : canonicalUrl,
      next:
        productsData.currentPage < productsData.totalPages
          ? `${url}/category/?page=${productsData.currentPage + 1}`
          : canonicalUrl,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Головна",
          item: url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: currentCategories.name[locale as ILocale],
          item: canonicalUrl,
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ProductListJsonLd;
