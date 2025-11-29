export default async function ProductPage({
  params,
}: {
  params: Promise<{ ordersId: string }>;
}) {
  const ordersId = (await params).ordersId;

  return (
    <div>
      <h1>Order ID: {ordersId}</h1>
    </div>
  );
}
