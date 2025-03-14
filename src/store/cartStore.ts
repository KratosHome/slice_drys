'use client'

import { createOrder } from '@/server/orders/create-order'
import { generateId } from '@/utils/generateId'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { create } from 'zustand'

interface IAddItemToCartProps {
  id: string
  quantity: number
  maxQuantity?: number
  image?: string
  name?: string
  price?: number
  weight?: number
}

interface ICartState {
  openCart: boolean
  totalPrice: number
  totalProducts: number
  minOrderAmount: number
  cart: ICart
}

interface ICartActions {
  setCartUserData: (data: IUserData) => void
  addItemToCart: (props: IAddItemToCartProps) => void
  updateItemQuantity: (
    id: string,
    quantity: number,
    maxQuantity: number,
  ) => void
  clearCart: () => void
  removeItemFromCart: (id: string) => void
  setOpenCart: (openCart: boolean) => void
  submitOrder: () => Promise<IResponse>
}

export const useCartStore = create<ICartState & ICartActions>()(
  subscribeWithSelector(
    persist(
      (set, get) => {
        const recalculateCart = (cart: ICart) => {
          const totalPrice: number =
            cart.itemList?.reduce(
              (acc, item) => acc + item.price * item.quantity,
              0,
            ) || 0
          const totalProducts =
            cart.itemList?.reduce((acc, item) => acc + item.quantity, 0) || 0

          return { totalPrice, totalProducts }
        }

        return {
          cart: { itemList: [], userData: {} },
          openCart: false,
          totalPrice: 0,
          totalProducts: 0,
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
              const existingItem: ICartItem | undefined =
                state.cart.itemList?.find((item) => item.id === id)

              let updatedItemList: ICartItem[] | undefined

              if (existingItem) {
                updatedItemList = state.cart.itemList?.map((item) =>
                  item.id === id
                    ? {
                        ...item,
                        quantity: item.quantity + quantity,
                        maxQuantity,
                      }
                    : item,
                )
              } else {
                updatedItemList = [
                  ...(state.cart.itemList ?? []),
                  { id, quantity, image, name, price, weight, maxQuantity },
                ]
              }

              const updatedCart = { ...state.cart, itemList: updatedItemList }

              return { cart: updatedCart, ...recalculateCart(updatedCart) }
            })
          },
          updateItemQuantity: (id, quantity, maxQuantity) => {
            set((state) => {
              const newQuantity: number = Math.min(
                Math.max(quantity, 1),
                maxQuantity,
              )

              const updatedItemList: ICartItem[] | undefined =
                state.cart.itemList?.map((item) =>
                  item.id === id ? { ...item, quantity: newQuantity } : item,
                )

              const updatedCart = { ...state.cart, itemList: updatedItemList }

              return { cart: updatedCart, ...recalculateCart(updatedCart) }
            })
          },
          removeItemFromCart: (id: string) => {
            set((state) => {
              const updatedItemList: ICartItem[] =
                state.cart.itemList?.filter((item) => item.id !== id) || []

              const updatedCart = { ...state.cart, itemList: updatedItemList }

              return { cart: updatedCart, ...recalculateCart(updatedCart) }
            })
          },
          clearCart: () => {
            set(() => {
              localStorage.removeItem('slice-drys-cart')

              return {
                cart: { itemList: [], userData: {} },
                totalPrice: 0,
                totalProducts: 0,
              }
            })
          },
          setCartUserData: (data) => {
            set((state) => ({ cart: { ...state.cart, userData: data } }))
          },
          submitOrder: async () => {
            const { cart, totalPrice, clearCart } = get()

            if (!cart.itemList || cart.itemList.length === 0) {
              return { success: false, message: 'Cart is empty' }
            }

            const userId: string = generateId('user')
            const orderId: string = generateId('order')

            const productsToSubmit: IOrderProduct[] = cart.itemList.map(
              (item) => ({
                id: item.id,
                name: item.name,
                count: item.quantity,
                price: item.price,
              }),
            )

            const userToSubmit: IOrderUser = {
              name: cart.userData?.name || '',
              surname: cart.userData?.surname || '',
              id: userId,
              phone: cart.userData?.phoneNumber || '',
              email: cart.userData?.email || '',
            }

            const deliveryToSubmit: IOrderDelivery = {
              city: cart.userData?.deliveryInfo?.city || '',
              department: cart.userData?.deliveryInfo?.brunch || '',
              phone: cart.userData?.phoneNumber || '',
            }

            const orderData: IOrder = {
              id: orderId,
              status: 'new' as const,
              products: productsToSubmit,
              total: totalPrice,
              delivery: deliveryToSubmit,
              user: userToSubmit,
              payment: {
                method:
                  (cart.userData?.paymentInfo as 'cash' | 'card') || 'cash',
              },
              comment: cart.userData?.comment || '',
            }

            try {
              const response: IResponse = await createOrder(orderData)

              if (response.success) clearCart()

              return response
            } catch (error) {
              return {
                success: false,
                message: `Failed to create order: ${error}`,
              }
            }
          },
        }
      },
      {
        name: 'slice-drys-cart',
        partialize: (state) => ({
          cart: state.cart,
          totalPrice: state.totalPrice,
          totalProducts: state.totalProducts,
        }),
      },
    ),
  ),
)
