import { FC } from 'react'

interface mainJsonLdProps {
  products: IProduct[]
  faq: IFaq[]
  reviews: {
    author: string
    text: string
  }[]
}
const MainJsonLd: FC<mainJsonLdProps> = ({ products, faq }) => {
  const baseUrl = process.env.NEXT_URL

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
            telephone: '+380123456789', // TODO: Add real phone number
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
      {
        '@type': 'Review',
        '@id': 'https://example.com/#review1',
        reviewBody:
          "Дуже смачні та корисні! Люблю курячі сушеники від Slice & Dry's.",
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Олександр',
        },
      },
      {
        '@type': 'Review',
        '@id': 'https://example.com/#review2',
        reviewBody: 'Просто фантастика! Легкий перекус для будь-якої ситуації.',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Анна',
        },
      },
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
