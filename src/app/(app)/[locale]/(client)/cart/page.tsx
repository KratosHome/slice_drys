import CartList from '@/components/client/cart/cart-list'

export default async function Cart(props: { params: Params }) {
  const { locale } = await props.params

  return (
    <div>
      {locale}
      <CartList />
    </div>
  )
}
