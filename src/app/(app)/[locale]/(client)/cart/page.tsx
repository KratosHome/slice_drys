import Cart from '@/components/client/cart/cart'

export default async function CartPage() {
  //props: { params: Params }) {
  // const { locale } = await props.params

  return (
    <div>
      <div className="flex">
        <Cart />
      </div>
    </div>
  )
}
