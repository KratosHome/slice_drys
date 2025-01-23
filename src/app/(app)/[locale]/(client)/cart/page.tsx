import CartList from '@/components/client/cart/cart-list'

export default async function Cart(props: { params: Params }) {
  const { locale } = await props.params

  return (
    <div>
      <div className="flex">
        <div className="flex-1">{locale}</div>
        <div className="flexflex-1 p-10">
          <CartList />
        </div>
      </div>
    </div>
  )
}
