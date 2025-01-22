import { create } from 'zustand'

type CartItem = {
  id: string
  quantity: number
}

type CartState = {
  cart: CartItem[]
  addToCart: (id: string, quantity?: number) => void
}

export const useCartStore = create<CartState>(function (set) {
  return {
    cart: JSON.parse(localStorage.getItem('cart') || '[]'),
    addToCart: function (id: string, quantity: number = 1) {
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
          updatedCart = [...state.cart, { id, quantity }]
        }

        localStorage.setItem('cart', JSON.stringify(updatedCart))
        return { cart: updatedCart }
      })
    },
  }
})
