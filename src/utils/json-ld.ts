import { contacts, SITE_URL } from '@/data/contacts'

type JsonLdNode = Record<string, unknown>

export const SITE_ORIGIN = SITE_URL.replace(/\/+$/, '')
const BRAND_NAME = "Slice & Dry's"
export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`
const LOGO_URL = `${SITE_ORIGIN}/icons/logo-square.svg`
const LOGO_ID = `${SITE_ORIGIN}/#logo`

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

export function languageTag(locale: ILocale): string {
  return locale === 'uk' ? 'uk-UA' : 'en'
}

export function localizedUrl(locale: ILocale, path = ''): string {
  const normalizedPath = path.replace(/^\/+|\/+$/g, '')

  return `${SITE_ORIGIN}/${locale}${normalizedPath ? `/${normalizedPath}` : ''}`
}

export function absoluteUrl(value?: string): string | undefined {
  if (!value?.trim()) return undefined

  try {
    return new URL(value, `${SITE_ORIGIN}/`).toString()
  } catch {
    return undefined
  }
}

export function toIsoDate(
  value: Date | string | undefined,
): string | undefined {
  if (!value) return undefined

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export function buildOrganization(locale: ILocale): JsonLdNode {
  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: BRAND_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': LOGO_ID,
      url: LOGO_URL,
      contentUrl: LOGO_URL,
      width: 512,
      height: 512,
    },
    image: { '@id': LOGO_ID },
    email: contacts.mail,
    telephone: contacts.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contacts.address[locale],
      addressCountry: 'UA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: contacts.phone,
      email: contacts.mail,
      contactType: 'customer service',
      areaServed: {
        '@type': 'Country',
        name: 'Ukraine',
      },
      availableLanguage: ['uk', 'en'],
      url: localizedUrl(locale, 'contacts'),
    },
    sameAs: [contacts.facebook, contacts.instagram],
  }
}

export function buildWebsite(): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_ORIGIN}/`,
    name: BRAND_NAME,
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: ['uk-UA', 'en'],
  }
}

export function buildBreadcrumbList(
  id: string,
  items: ReadonlyArray<{ name: string; url: string }>,
): JsonLdNode {
  return {
    '@type': 'BreadcrumbList',
    '@id': id,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

function validPrice(value: unknown): number | undefined {
  const price = Number(value)

  return Number.isFinite(price) && price > 0 ? price : undefined
}

function effectivePrice(variable: IVariableProduct): number | undefined {
  const price = validPrice(variable.price)
  const salePrice = validPrice(variable.newPrice)

  if (salePrice !== undefined && (price === undefined || salePrice < price)) {
    return salePrice
  }

  return price
}

function currencyCode(value: string): string {
  const normalized = value.trim().toUpperCase()

  return /^[A-Z]{3}$/.test(normalized) ? normalized : 'UAH'
}

export function buildProductNode(
  product: IProduct,
  canonicalUrl: string,
): JsonLdNode {
  const productSku = String(product._id || product.slug)
  const images = Array.from(
    new Set(
      [product.img, ...(product.images ?? [])]
        .map((image) => absoluteUrl(image))
        .filter((image): image is string => Boolean(image)),
    ),
  )

  const offers = product.variables.flatMap((variable, index) => {
    const price = effectivePrice(variable)
    if (price === undefined) return []

    const variantId = String(variable._id ?? variable.weight ?? index + 1)
    const count = Number(variable.count)

    return [
      {
        '@type': 'Offer',
        '@id': `${canonicalUrl}#offer-${encodeURIComponent(variantId)}`,
        url: canonicalUrl,
        name:
          variable.weight > 0
            ? `${product.name} — ${variable.weight} g`
            : product.name,
        sku: `${productSku}-${variantId}`,
        price,
        priceCurrency: currencyCode(variable.currency || 'UAH'),
        availability:
          Number.isFinite(count) && count > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        inventoryLevel: {
          '@type': 'QuantitativeValue',
          value: Number.isFinite(count) && count >= 0 ? count : 0,
        },
        seller: { '@id': ORGANIZATION_ID },
      },
    ]
  })
  const description =
    typeof product.metaDescription === 'string'
      ? product.metaDescription
      : typeof product.description === 'string'
        ? product.description
        : undefined

  return {
    '@type': 'Product',
    '@id': `${canonicalUrl}#product`,
    url: canonicalUrl,
    name: product.name,
    description,
    image: images.length > 0 ? images : undefined,
    sku: productSku,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: BRAND_NAME,
    },
    offers: offers.length > 0 ? offers : undefined,
  }
}
