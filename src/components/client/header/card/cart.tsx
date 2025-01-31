'use client'
import Image from 'next/image'
import Button from '@/components/client/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/client/ui/popover'
import { useCartStore } from '@/store/cartStore'

export default function Cart() {
  const { openCart, setOpenCart, cart } = useCartStore((state) => state)

  return (
    <div className="relative inline-block">
      <Popover open={openCart} onOpenChange={setOpenCart}>
        <PopoverTrigger>
          <Button variant="icons">
            <Image src={'/icons/bin.svg'} width={32} height={32} alt="cart" />
            <span className="absolute -right-1 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
              {cart.itemList?.length}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="mr-0 w-full max-w-md rounded-lg bg-white p-4 md:!mr-32">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-bold">КОШИК</h2>
          </div>
          <div className="max-h-[400px] space-y-4 overflow-y-auto">
            {cart.itemList?.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-2">
                <div className="capitalize"> {item.name}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t pt-2">
            <p className="text-lg font-bold">До сплати:</p>
            <p className="text-lg font-bold">грн</p>
          </div>
          <div className="flex gap-2">
            <Button>Продовжити покупки</Button>
            <Button className="bg-black text-white">Оформити замовлення</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
