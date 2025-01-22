import { create } from 'zustand'

type CartItem = {
  id: string
  quantity: number
  image: string
  name: string
  price: number
  weight: number
}

type CartState = {
  cart: CartItem[]
  addToCart: (
    id: string,
    quantity: number,
    image: string,
    name: string,
    price: number,
    weight: number,
  ) => void
  clearCart: () => void
  removeFromCart: (id: string) => void
}

export const useCartStore = create<CartState>(function (set) {
  return {
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    addToCart: function (
      id: string,
      quantity: number = 1,
      image: string = '',
      name: string = '',
      price: number = 0,
      weight: number = 0,
    ) {
      set(function (state) {
        const existingItem = state.cart.find(function (item) {
          return item.id === id
        })
        let updatedCart
        if (existingItem) {
          updatedCart = state.cart.map(function (item) {
            return item.id === id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          })
        } else {
          updatedCart = [
            ...state.cart,
            { id, quantity, image, name, price, weight },
          ]
        }

        localStorage.setItem('cart', JSON.stringify(updatedCart))
        return { cart: updatedCart }
      })
    },
    removeFromCart: function (id: string) {
      set(function (state) {
        const updatedCart = state.cart.filter(function (item) {
          return item.id !== id
        })

        localStorage.setItem('cart', JSON.stringify(updatedCart))
        return { cart: updatedCart }
      })
    },
    clearCart: function () {
      set({ cart: [] })
      localStorage.setItem('cart', '[]')
    },
  }
})
