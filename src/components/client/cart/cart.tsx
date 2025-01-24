import CartForm from '@/components/client/cart/cart-form'
import CartList from '@/components/client/cart/cart-list'

export default function Cart() {
  return (
    <div className="flex p-10">
      <CartForm />
      <div>
        <div className="bg-black text-center text-white">
          Перегляд замовлення
        </div>
        <CartList />
        <div className="mx-auto mt-3 cursor-pointer bg-black p-2 text-center text-white">
          Оформити замовлення
        </div>
      </div>
    </div>
  )
}
