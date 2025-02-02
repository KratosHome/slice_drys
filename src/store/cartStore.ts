import { create } from 'zustand'

const isBrowser = typeof window !== 'undefined'

type CartItem = {
  id: string
  quantity: number
  image: string
  name: string
  price: number
  weight: number
  maxQuantity: number
}

interface DeliveryInfo {
  city?: string
  brunch?: string
  deliveryMethod?: string
  courierInfo?: string
}

interface FormData {
  name?: string
  surname?: string
  phoneNumber?: string
  email?: string
  formStep?: number
  deliveryInfo?: DeliveryInfo
  paymentInfo?: string
  comment?: string
  acceptTerms?: boolean
  noCall?: boolean
}
type CartState = {
  openCart: boolean
  totalPrice?: number
  minOrderAmount: number
  cart: {
    itemList?: CartItem[] | undefined
    formData?: FormData | undefined
  }
  setCartFormData: (data: FormData) => void
  addItemToCart: (props: {
    id: string
    quantity: number
    maxQuantity: number
    image?: string
    name?: string
    price?: number
    weight?: number
  }) => void
  updateItemQuantity: (
    id: string,
    quantity: number,
    maxQuantity: number,
  ) => void
  clearCart: () => void
  removeItemFromCart: (id: string) => void
  setOpenCart: (openCart: boolean) => void
}

export const useCartStore = create<CartState>((set) => ({
  cart: isBrowser ? JSON.parse(localStorage.getItem('cart') || '{}') : {},
  openCart: false,
  minOrderAmount: 300,
  setOpenCart: (openCart: boolean) => set({ openCart }),
  addItemToCart: (props) => {
    const {
      id,
      quantity = 1,
      image = '',
      name = '',
      price = 0,
      weight = 0,
      maxQuantity = 0,
    } = props
    set((state) => {
      const existingItem = state.cart.itemList?.find((item) => item.id === id)
      let updatedItemList
      if (existingItem) {
        updatedItemList = state.cart.itemList?.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity, maxQuantity }
            : item,
        )
      } else {
        updatedItemList = [
          ...(state.cart.itemList ?? []),
          { id, quantity, image, name, price, weight, maxQuantity },
        ]
      }

      const updatedCart = { ...state.cart, itemList: updatedItemList }
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return { cart: updatedCart }
    })
  },

  updateItemQuantity: (id, quantity, maxQuantity) => {
    set((state) => {
      const newQuantity = Math.min(Math.max(quantity, 1), maxQuantity)
      const updatedItemList = state.cart.itemList?.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item,
      )

      const updatedCart = { ...state.cart, itemList: updatedItemList }
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return { cart: updatedCart }
    })
  },

  removeItemFromCart: (id: string) => {
    set((state) => {
      const updatedItemList =
        state.cart.itemList?.filter((item) => item.id !== id) || []

      const updatedCart = { ...state.cart, itemList: updatedItemList }
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return { cart: updatedCart }
    })
  },
  clearCart: () => {
    set((state) => {
      const updatedCart = { ...state.cart, itemList: [] }
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return { cart: updatedCart }
    })
  },
  setCartFormData: (data) => {
    set((state) => {
      const updatedCart = { ...state.cart, formData: data }
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return { cart: updatedCart }
    })
  },
}))
