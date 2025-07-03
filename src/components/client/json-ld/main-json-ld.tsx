interface IMainJsonLdProps {
  products: IProduct[]
  faq: IFaq[]
  reviews: IReviewLocal[]
}
export default function MainJsonLd({
  products,
  faq,
  reviews,
}: IMainJsonLdProps) {
  const SITE_URL: string | undefined = process.env.NEXT_URL

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: `${SITE_URL}`,
        name: "Slice & Dry's",
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: "Slice & Dry's",
        url: `${SITE_URL}`,
        logo: `${SITE_URL}/icons/logo.svg`,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+380939797910',
            contactType: 'customer service',
            areaServed: 'UA',
          },
        ],
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: `${SITE_URL}`,
        name: "Головна сторінка Slice & Dry's",
        inLanguage: 'uk',
        isPartOf: {
          '@id': `${SITE_URL}/#website`,
        },
      },
      ...products.map((product) => ({
        '@type': 'Product',
        '@id': `${SITE_URL}/${product.category}/${product.slug}`,
        name: product.name,
        image: product.img,
        description: product.description,
        brand: {
          '@type': 'Brand',
          name: "Slice & Dry's",
        },
        sku: product._id,
        offers: product.variables.map((variable) => ({
          '@type': 'Offer',
          url: `${SITE_URL}/${product.category}/${product.slug}`,
          priceCurrency: 'UAH',
          price: variable.price,
          itemCondition: 'https://schema.org/NewCondition',
          availability: 'https://schema.org/InStock',
        })),
      })),
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/#top-products`,
        name: 'Топові сушеники',
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${SITE_URL}/${product.category}/${product.slug}`,
        })),
      },
      ...reviews.map((review, index) => ({
        '@type': 'Review',
        '@id': `${SITE_URL}/#review${index + 1}`,
        reviewBody: review.text,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating.toString(),
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: review.author,
        },
        itemReviewed: {
          '@type': 'Organization',
          name: "Slice & Dry's",
          url: SITE_URL,
        },
      })),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
