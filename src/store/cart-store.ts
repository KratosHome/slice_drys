'use client'

import { createOrderServer } from '@/server/orders/create-order.server'
import { generateId } from '@/utils/generate-id'
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
  setCartUserData: (
    data: IUserData<
      IDeliveryInfo<'branch' | 'postomat' | 'courier', IComboboxData>
    >,
  ) => void
  addItemToCart: (props: IAddItemToCartProps) => void
  hasItemInCart: (id: string, weight: number) => boolean
  updateItemQuantity: (
    id: string,
    quantity: number,
    maxQuantity: number,
    weight: number,
  ) => void
  clearCart: (full?: boolean) => void
  removeItemFromCart: (id: string, weight: number) => void
  setOpenCart: (openCart: boolean) => void
  submitOrder: (cb: (resp: IOrderResponse) => void) => void
}
const initialUserData = {
  deliveryInfo: {
    deliveryMethod: 'branch' as IDeliveryMethods,
    deliveryProvider: 'novaPoshta',
  },
  paymentInfo: 'card' as PaymentMethods,
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
          cart: {
            itemList: [],
            userData: initialUserData,
          },
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
                state.cart.itemList?.find(
                  (item) => item.id === id && item.weight === weight,
                )

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
          hasItemInCart: (id, weight) => {
            return (
              get().cart.itemList?.some(
                (item) => item.id === id && item.weight === weight,
              ) ?? false
            )
          },
          updateItemQuantity: (
            id: string,
            quantity: number,
            maxQuantity: number,
            weight: number,
          ) => {
            set((state) => {
              const newQuantity: number = Math.min(
                Math.max(quantity, 1),
                maxQuantity,
              )

              const updatedItemList: ICartItem[] | undefined =
                state.cart.itemList?.map((item) =>
                  item.id === id && item.weight === weight
                    ? { ...item, quantity: newQuantity }
                    : item,
                )

              const updatedCart = { ...state.cart, itemList: updatedItemList }

              return { cart: updatedCart, ...recalculateCart(updatedCart) }
            })
          },
          removeItemFromCart: (id: string, weight: number) => {
            set((state) => {
              const updatedItemList: ICartItem[] =
                state.cart.itemList?.filter(
                  (item) => !(item.id === id && item.weight === weight),
                ) || []

              const updatedCart = { ...state.cart, itemList: updatedItemList }

              return { cart: updatedCart, ...recalculateCart(updatedCart) }
            })
          },
          clearCart: (full: boolean = false) => {
            set(() => {
              localStorage.removeItem('slice-drys-cart')

              return {
                cart: full
                  ? {
                      itemList: [],
                      userData: initialUserData,
                    }
                  : {
                      itemList: [],
                      userData: get().cart.userData,
                    },
                totalPrice: 0,
                totalProducts: 0,
              }
            })
          },
          setCartUserData: (data) => {
            set((state) => ({ cart: { ...state.cart, userData: data } }))
          },
          submitOrder: async (cb: (response: IOrderResponse) => void) => {
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
              city: cart.userData?.deliveryInfo?.city?.label || '',
              department: cart.userData?.deliveryInfo?.branch?.label || '',
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

            const response: IOrderResponse = await createOrderServer(orderData)

            if (response.success) {
              clearCart(true)
            }
            cb(response)
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
