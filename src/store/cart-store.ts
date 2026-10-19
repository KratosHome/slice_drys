'use client'

import { createOrderServer } from '@/server/orders/create-order.server'
import { MIN_ORDER_AMOUNT } from '@/constants/order'
import {
  getCartAnalyticsItems,
  trackEcommerceEvent,
  trackPurchase,
} from '@/utils/analytics'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { create } from 'zustand'

interface IAddItemToCartProps {
  id: string
  quantity: number
  maxQuantity?: number
  image?: string
  name?: string
  names?: ICartProductNames['names']
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
  setItemNames: (products: ICartProductNames[]) => void
  setOpenCart: (openCart: boolean) => void
  submitOrder: (
    referralCode: string | undefined,
    cb: (resp: IOrderResponse) => void,
  ) => void
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
        let submitting = false

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
          minOrderAmount: MIN_ORDER_AMOUNT,
          setOpenCart: (openCart: boolean) => {
            const state = get()
            if (openCart && !state.openCart) {
              trackEcommerceEvent(
                'view_cart',
                getCartAnalyticsItems(state.cart.itemList ?? []),
              )
            }
            set({ openCart })
          },
          addItemToCart: (props) => {
            const {
              id,
              quantity = 1,
              image = '',
              name = '',
              names,
              price = 0,
              weight = 0,
              maxQuantity = 0,
            } = props

            if (
              !id ||
              !Number.isSafeInteger(quantity) ||
              quantity <= 0 ||
              !Number.isSafeInteger(maxQuantity) ||
              maxQuantity <= 0 ||
              !Number.isFinite(price) ||
              price <= 0 ||
              !Number.isFinite(weight) ||
              weight <= 0
            )
              return

            const { cart } = get()
            const existingItem = cart.itemList?.find(
              (item) => item.id === id && item.weight === weight,
            )
            const previousQuantity = existingItem?.quantity ?? 0
            const nextQuantity = Math.min(
              previousQuantity + quantity,
              maxQuantity,
            )
            const addedQuantity = nextQuantity - previousQuantity
            if (addedQuantity <= 0) return

            const updatedItem = {
              id,
              quantity: nextQuantity,
              image,
              name,
              names: names ?? existingItem?.names,
              price,
              weight,
              maxQuantity,
            }
            const itemList = existingItem
              ? cart.itemList?.map((item) =>
                  item.id === id && item.weight === weight ? updatedItem : item,
                )
              : [...(cart.itemList ?? []), updatedItem]
            const updatedCart = { ...cart, itemList }
            set({ cart: updatedCart, ...recalculateCart(updatedCart) })
            trackEcommerceEvent(
              'add_to_cart',
              getCartAnalyticsItems([
                { ...updatedItem, quantity: addedQuantity },
              ]),
            )
          },
          setItemNames: (products) => {
            const productsById = new Map(
              products.map((product) => [product.id, product.names]),
            )
            set((state) => {
              let changed = false
              const itemList = state.cart.itemList?.map((item) => {
                const incoming = productsById.get(item.id)
                if (!incoming) return item
                const names = { ...item.names }
                for (const locale of ['uk', 'en'] as const) {
                  const name = incoming[locale]?.trim()
                  if (name && names[locale] !== name) {
                    names[locale] = name
                    changed = true
                  }
                }
                return names.uk === item.names?.uk &&
                  names.en === item.names?.en
                  ? item
                  : { ...item, names }
              })
              return changed ? { cart: { ...state.cart, itemList } } : state
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
            if (
              !Number.isSafeInteger(quantity) ||
              !Number.isSafeInteger(maxQuantity) ||
              maxQuantity <= 0
            )
              return

            const { cart } = get()
            const existingItem = cart.itemList?.find(
              (item) => item.id === id && item.weight === weight,
            )
            if (!existingItem) return
            const newQuantity = Math.min(Math.max(quantity, 1), maxQuantity)
            const delta = newQuantity - existingItem.quantity
            if (delta === 0) return

            const updatedCart = {
              ...cart,
              itemList: cart.itemList?.map((item) =>
                item.id === id && item.weight === weight
                  ? { ...item, quantity: newQuantity, maxQuantity }
                  : item,
              ),
            }
            set({ cart: updatedCart, ...recalculateCart(updatedCart) })
            trackEcommerceEvent(
              delta > 0 ? 'add_to_cart' : 'remove_from_cart',
              getCartAnalyticsItems([
                { ...existingItem, quantity: Math.abs(delta) },
              ]),
            )
          },
          removeItemFromCart: (id: string, weight: number) => {
            const removedItem = get().cart.itemList?.find(
              (item) => item.id === id && item.weight === weight,
            )
            set((state) => {
              const updatedItemList: ICartItem[] =
                state.cart.itemList?.filter(
                  (item) => !(item.id === id && item.weight === weight),
                ) || []

              const updatedCart = { ...state.cart, itemList: updatedItemList }

              return { cart: updatedCart, ...recalculateCart(updatedCart) }
            })
            if (removedItem) {
              trackEcommerceEvent(
                'remove_from_cart',
                getCartAnalyticsItems([removedItem]),
              )
            }
          },
          clearCart: (full: boolean = false) => {
            if (!full) {
              trackEcommerceEvent(
                'remove_from_cart',
                getCartAnalyticsItems(get().cart.itemList ?? []),
              )
            }
            set(() => {
              try {
                localStorage.removeItem('slice-drys-cart')
              } catch {
                // The in-memory cart still clears when browser storage is disabled.
              }

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
          submitOrder: async (
            referralCode: string | undefined,
            cb: (response: IOrderResponse) => void,
          ) => {
            if (submitting) return
            const { cart, clearCart } = get()

            if (!cart.itemList || cart.itemList.length === 0) {
              cb({
                success: false,
                message: { uk: 'Кошик порожній', en: 'Cart is empty' },
              })
              return
            }

            const productsToSubmit: ICreateOrderProduct[] = cart.itemList.map(
              (item) => ({
                id: item.id,
                count: item.quantity,
                weight: item.weight,
              }),
            )

            const userToSubmit: ICreateOrderUser = {
              name: cart.userData?.name || '',
              surname: cart.userData?.surname || '',
              phone: cart.userData?.phoneNumber || '',
              email: cart.userData?.email || '',
            }

            const courierInfo = cart.userData?.deliveryInfo?.courierInfo
            const deliveryToSubmit: ICreateOrderDelivery = courierInfo
              ? {
                  courier: courierInfo,
                  phone: cart.userData?.phoneNumber || '',
                }
              : {
                  city: cart.userData?.deliveryInfo?.city?.label || '',
                  department: cart.userData?.deliveryInfo?.branch?.label || '',
                  phone: cart.userData?.phoneNumber || '',
                }

            const orderData: ICreateOrderInput = {
              products: productsToSubmit,
              delivery: deliveryToSubmit,
              user: userToSubmit,
              payment: {
                method:
                  (cart.userData?.paymentInfo as 'cash' | 'card') || 'cash',
              },
              comment: cart.userData?.comment || '',
              referralCode,
              noCall: cart.userData?.noCall === true,
            }

            submitting = true
            try {
              const response: IOrderResponse =
                await createOrderServer(orderData)
              if (response.success) {
                if (response.receipt) trackPurchase(response.receipt)
                clearCart(true)
              }
              cb(response)
            } catch {
              cb({
                success: false,
                message: {
                  uk: 'Не вдалося оформити замовлення. Спробуйте ще раз.',
                  en: 'Unable to place the order. Please try again.',
                },
              })
            } finally {
              submitting = false
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
