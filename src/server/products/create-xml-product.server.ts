'use server'
import { connectToDbServer } from '@/server/connect-to-db.server'
import { Product } from '@/server/products/product-schema.server'
import fs from 'fs'
import path from 'path'

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'\"]/g, (c) => {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '\"':
        return '&quot;'
      default:
        return c
    }
  })
}

function formatPrice(price: number, currency: string = 'UAH'): string {
  return `${price.toFixed(2)} ${currency}`
}

export async function createXmlProduct(locale: string = 'uk') {
  'use server'
  try {
    await connectToDbServer()
    const products = await Product.find({})

    const baseUrl = 'https://slicedrys.com'

    let xml = `<?xml version="1.0"?>\n`
    xml += `<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n`
    xml += `  <channel>\n`
    xml += `    <title>Slice Drys</title>\n`
    xml += `    <link>${baseUrl}</link>\n`
    xml += `    <description>Документ формату RSS 2.0, що містить товари</description>\n`

    products.forEach((product) => {
      const variant = product.variables?.[0] || {}
      const hasDiscount = variant.newPrice && variant.price

      const price = hasDiscount
        ? formatPrice(variant.newPrice, variant.currency)
        : formatPrice(variant.price, variant.currency)

      const weight = variant.weight ? variant.weight + 'kg' : ''

      xml += `    <item>\n`
      xml += `      <g:id>${String(product._id)}</g:id>\n`
      xml += `      <g:title>Джерки ${escapeXml(product.name[locale])}</g:title>\n`
      xml += `      <g:description>${escapeXml(product.metaDescription?.[locale])}</g:description>\n`
      xml += `      <g:link>${baseUrl}/product/${product.slug}</g:link>\n`
      xml += `      <g:image_link>${product.img}</g:image_link>\n`
      xml += `      <g:condition>new</g:condition>\n`
      xml += `      <g:availability>in stock</g:availability>\n`
      xml += `      <g:google_product_category>Food, Beverages Tobacco > Grocery Gourmet Food > Meat, Poultry Seafood > Jerky</g:google_product_category>\n`
      xml += `      <g:product_type>Закуски та снеки > Джерки</g:product_type>\n`
      xml += `      <g:flavor>${escapeXml(product.name[locale])}</g:flavor>\n`

      if (hasDiscount) {
        xml += `      <g:price>${formatPrice(variant.price, variant.currency)}</g:price>\n`
        xml += `      <g:sale_price>${formatPrice(variant.newPrice, variant.currency)}</g:sale_price>\n`
      } else {
        xml += `      <g:price>${price}</g:price>\n`
      }

      xml += `      <g:shipping_weight>${weight}</g:shipping_weight>\n`
      xml += `      <g:shipping>\n`
      xml += `        <g:country>UA</g:country>\n`
      xml += `        <g:service>Standard</g:service>\n`
      xml += `        <g:price>0.00 UAH</g:price>\n`
      xml += `      </g:shipping>\n`
      xml += `      <g:brand>Slice Drys</g:brand>\n`
      xml += `    </item>\n`
    })

    xml += `  </channel>\n`
    xml += `</rss>\n`

    const now = new Date()
    const formattedDate = now
      .toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .split('Z')[0]
    const filePath = path.join(process.cwd(), `products_${formattedDate}.xml`)

    fs.writeFileSync(filePath, xml, 'utf8')

    return { success: true, message: 'XML файл успішно створено' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Щось пішло не так' }
  }
}
