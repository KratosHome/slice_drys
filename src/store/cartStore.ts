import { create } from 'zustand'

type CartItem = {
  id: string
  quantity: number
  image: string
  name: string
  price: number
  weight: number
}
type FormData = {
  name: string
  surname: string
  phoneNumber: string
  email: string
  formStep: number
  deliveryInfo: string
  paymentInfo: string
  comment: string
  acceptTerms: boolean
  noCall: boolean
}

type CartState = {
  cart: {
    itemList?: CartItem[] | undefined
    formData?: FormData | undefined
  }
  setCartFormData: (data: FormData) => void
  addItemToCart: (
    id: string,
    quantity: number,
    image: string,
    name: string,
    price: number,
    weight: number,
  ) => void
  clearCart: () => void
  removeItemFromCart: (id: string) => void
}

export const useCartStore = create<CartState>((set) => ({
  cart: JSON.parse(localStorage.getItem('cart') || '{}'),
  addItemToCart: (
    id: string,
    quantity: number = 1,
    image: string = '',
    name: string = '',
    price: number = 0,
    weight: number = 0,
  ) => {
    set((state) => {
      const existingItem = state.cart.itemList?.find((item) => item.id === id)
      let updatedItemList
      if (existingItem) {
        updatedItemList = state.cart.itemList?.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      } else {
        updatedItemList = [
          ...(state.cart.itemList ?? []),
          { id, quantity, image, name, price, weight },
        ]
      }

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
    const clearedCart = { ...{}, itemList: [] }
    set({ cart: clearedCart })
    localStorage.setItem('cart', JSON.stringify(clearedCart))
  },
  setCartFormData: (data) => {
    set((state) => {
      const updatedCart = { ...state.cart, formData: data }
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      return { cart: updatedCart }
    })
  },
}))
