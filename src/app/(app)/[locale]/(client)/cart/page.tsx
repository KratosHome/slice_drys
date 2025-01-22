export default async function Cart(props: { params: Params }) {
  const { locale } = await props.params

  return <div>{locale}</div>
}
