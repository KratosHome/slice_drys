type Params = Promise<{ locale: ILocale }>

export default async function Page({ params }: { params: Params }) {
  const { locale } = await params

  let MarkdownToHtml
  try {
    MarkdownToHtml = await import(
      `@/data/public-offer/${locale}-public-offer.mdx`
    )
  } catch (error) {
    console.error(`Cannot load privacy policy for locale: ${locale}`, error)
    return <div>Error loading privacy public offer content.</div>
  }

  return (
    <div className="prose mx-auto px-4 py-10">
      <article>
        <MarkdownToHtml.default />
      </article>
    </div>
  )
}
