import 'quill/dist/quill.snow.css'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import { getTranslations } from 'next-intl/server'

export const ProductDescription = async ({
  description,
}: {
  description: string
}) => {
  const t = await getTranslations('product')
  const content = JSON.parse(description)
  const html = new QuillDeltaToHtmlConverter(content.ops).convert()

  return (
    <section
      aria-labelledby="product-description-heading"
      className="mx-auto mb-10 max-w-[988px]"
    >
      <h2
        id="product-description-heading"
        className="mb-5 text-2xl font-semibold sm:text-[28px]"
      >
        {t('about-product')}
      </h2>
      <article
        id="editor"
        className="ql-editor prose lg:prose-lg max-w-none p-0! text-base leading-7"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </section>
  )
}
