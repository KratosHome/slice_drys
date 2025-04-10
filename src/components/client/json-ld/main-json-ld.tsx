import { FC } from 'react'

interface mainJsonLdProps {
  products: IProduct[]
  faq: IFaq[]
  reviews: IReviewLocal[]
}
const MainJsonLd: FC<mainJsonLdProps> = ({ products, faq, reviews }) => {
  const baseUrl = process.env.NEXT_URL

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        url: 'https://slicedrys.com',
        name: "Slice & Dry's",
        publisher: {
          '@id': `${baseUrl}/#organization`,
        },
      },
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: "Slice & Dry's",
        url: `${baseUrl}`,
        logo: `${baseUrl}/icons/logo.svg`,
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
        '@id': `${baseUrl}/#webpage`,
        url: `${baseUrl}`,
        name: "Головна сторінка Slice & Dry's",
        inLanguage: 'uk',
        isPartOf: {
          '@id': `${baseUrl}/#website`,
        },
      },
      ...products.map((product) => ({
        '@type': 'Product',
        '@id': `${baseUrl}/${product.category}/${product.slug}`,
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
          url: `${baseUrl}/${product.category}/${product.slug}`,
          priceCurrency: 'UAH',
          price: variable.price,
          itemCondition: 'https://schema.org/NewCondition',
          availability: 'https://schema.org/InStock',
        })),
      })),
      {
        '@type': 'FAQPage',
        '@id': `${baseUrl}/#faq`,
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.title,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.description,
          },
        })),
      },
      {
        '@type': 'ItemList',
        '@id': `${baseUrl}/#top-products`,
        name: 'Топові сушеники',
        itemListElement: products.map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: `${baseUrl}/${product.category}/${product.slug}`,
        })),
      },
      ...reviews.map((review, index) => ({
        '@type': 'Review',
        '@id': `${baseUrl}/#review${index + 1}`,
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
          url: baseUrl,
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

export default MainJsonLd
