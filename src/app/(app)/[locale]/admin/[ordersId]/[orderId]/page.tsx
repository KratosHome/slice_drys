export default async function ProductPage(props: any) {
  const params = await props.params
  const { ordersId } = params

  return (
    <div>
      <h1>Order ID: {ordersId}</h1>
    </div>
  )
}
