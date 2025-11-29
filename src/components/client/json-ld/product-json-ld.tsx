import { FC } from "react";

interface ProductJsonLdProps {
  productData: IProduct;
  canonicalUrl: string;
}

const ProductJsonLd: FC<ProductJsonLdProps> = ({
  productData,
  canonicalUrl,
}) => {
  const offersList = productData.variables.map((variant) => ({
    "@type": "Offer",
    url: canonicalUrl,
    priceCurrency: "UAH",
    price: variant.price,
    availability:
      variant.count && variant.count > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    itemCondition: "https://schema.org/NewCondition",
  }));

  const prices = productData.variables.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productData.name,
    description: productData.metaDescription,
    image: productData.img,
    sku: canonicalUrl,
    brand: {
      "@type": "Brand",
      name: "SliceDrys",
    },
    offers: {
      "@type": "AggregateOffer",
      lowPrice: minPrice,
      highPrice: maxPrice,
      priceCurrency: "UAH",
      offerCount: productData.variables.length,
      offers: offersList,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ProductJsonLd;
