export default async function Products({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params //eslint-disable-line

  return <div className="px-5">sdf s</div>
}
