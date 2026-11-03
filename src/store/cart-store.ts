'use client'

import { createOrderServer } from '@/server/orders/create-order.server'
import { MIN_ORDER_AMOUNT } from '@/constants/order'
import {
  getCartAnalyticsItems,
  trackCheckoutError,
  trackEcommerceEvent,
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

interface CheckoutAttempt {
  key: string
  input?: ICreateOrderInput
}

interface ICartState {
  checkout?: CheckoutAttempt
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
  ) => Promise<void>
}

const initialUserData = {
  deliveryInfo: {
    deliveryMethod: 'branch' as IDeliveryMethods,
    deliveryProvider: 'novaPoshta',
  },
  paymentInfo: 'card' as PaymentMethods,
}

function newCheckoutKey(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID()

  // getRandomValues also works where the browser restricts randomUUID to HTTPS.
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('')
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-')
}

function buildOrderInput(
  cart: ICart,
  key: string,
  referralCode?: string,
): ICreateOrderInput {
  const { userData } = cart
  const phone = userData?.phoneNumber || ''
  const courier = userData?.deliveryInfo?.courierInfo
  return {
    idempotencyKey: key,
    ...(referralCode !== undefined ? { referralCode } : {}),
    products: (cart.itemList ?? []).map(({ id, quantity, weight }) => ({
      id,
      count: quantity,
      weight,
    })),
    user: {
      name: userData?.name || '',
      surname: userData?.surname || '',
      phone,
      email: userData?.email || '',
    },
    delivery: courier
      ? { courier, phone }
      : {
          city: userData?.deliveryInfo?.city?.label || '',
          department: userData?.deliveryInfo?.branch?.label || '',
          phone,
        },
    payment: { method: userData?.paymentInfo || 'cash' },
    comment: userData?.comment || '',
    noCall: userData?.noCall === true,
  }
}

export const useCartStore = create<ICartState & ICartActions>()(
  subscribeWithSelector(
    persist(
      (set, get) => {
        let submission: Promise<IOrderResponse> | undefined

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

        const placeOrder = async (
          referralCode: string | undefined,
        ): Promise<IOrderResponse> => {
          const { cart, checkout } = get()
          if (!checkout?.input && !cart.itemList?.length) {
            return {
              success: false,
              errorCode: 'cart_empty',
              message: { uk: 'Кошик порожній', en: 'Cart is empty' },
            }
          }

          let response: IOrderResponse
          let input: ICreateOrderInput
          try {
            const key = checkout?.key ?? newCheckoutKey()
            input = checkout?.input ?? buildOrderInput(cart, key, referralCode)
            // Persist the exact request before dispatch, including on retry. The
            // editable cart may change while the server is accepting this input.
            if (!useCartStore.persist)
              throw new Error('Cart storage unavailable')
            set({ checkout: { key, input } })
          } catch {
            if (!checkout?.input && get().checkout?.input) {
              // persist updates memory before localStorage. No request was
              // dispatched, so the shopper can still correct this draft.
              try {
                set({ checkout })
              } catch {
                // The in-memory rollback also ran before this storage error.
              }
            }
            return {
              success: false,
              errorCode: 'checkout_unavailable',
              message: {
                uk: 'Не вдалося підготувати замовлення. Повторіть спробу.',
                en: 'We could not prepare your order. Please try again.',
              },
            }
          }
          try {
            response = await createOrderServer(input)
          } catch {
            return {
              success: false,
              errorCode: 'transport_error',
              message: {
                uk: 'Не вдалося підтвердити замовлення. Повторіть початкове оформлення, щоб отримати квитанцію.',
                en: 'We could not confirm your order. Retry the original checkout to get its receipt.',
              },
            }
          }

          if (get().checkout?.key !== input.idempotencyKey) return response
          try {
            if (response.success) {
              const draft = buildOrderInput(
                get().cart,
                input.idempotencyKey,
                input.referralCode,
              )
              if (JSON.stringify(draft) === JSON.stringify(input)) {
                set({
                  checkout: undefined,
                  cart: { itemList: [], userData: initialUserData },
                  totalPrice: 0,
                  totalProducts: 0,
                })
              } else {
                // Confirmation is for the original order. A later, explicit
                // purchase of the edited draft is a separate checkout.
                set({
                  checkout: get().cart.itemList?.length
                    ? { key: newCheckoutKey() }
                    : undefined,
                })
              }
            } else if (
              response.errorCode === 'invalid_order' ||
              response.errorCode === 'minimum_order_amount' ||
              response.errorCode === 'product_unavailable'
            ) {
              // Allow corrections under the same key. If an earlier request is
              // still running, MongoDB's unique index fences both requests.
              set({ checkout: { key: input.idempotencyKey } })
            }
          } catch {
            // Persist middleware updates memory before writing to storage. If
            // that write fails, the stored snapshot remains safe to replay.
          }
          return response
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
            set({
              cart: updatedCart,
              checkout: get().checkout ?? { key: newCheckoutKey() },
              ...recalculateCart(updatedCart),
            })
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
            set({
              cart: updatedCart,
              ...recalculateCart(updatedCart),
            })
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
            if (!removedItem) return
            set((state) => {
              const updatedItemList: ICartItem[] =
                state.cart.itemList?.filter(
                  (item) => !(item.id === id && item.weight === weight),
                ) || []

              const updatedCart = { ...state.cart, itemList: updatedItemList }

              return {
                cart: updatedCart,
                ...recalculateCart(updatedCart),
              }
            })
            trackEcommerceEvent(
              'remove_from_cart',
              getCartAnalyticsItems([removedItem]),
            )
          },
          clearCart: (full: boolean = false) => {
            if (!full) {
              trackEcommerceEvent(
                'remove_from_cart',
                getCartAnalyticsItems(get().cart.itemList ?? []),
              )
            }
            set({
              cart: {
                itemList: [],
                userData: full ? initialUserData : get().cart.userData,
              },
              totalPrice: 0,
              totalProducts: 0,
            })
          },
          setCartUserData: (data) => {
            set((state) => ({ cart: { ...state.cart, userData: data } }))
          },
          submitOrder: async (
            referralCode: string | undefined,
            cb: (response: IOrderResponse) => void,
          ) => {
            if (!submission) {
              submission = placeOrder(referralCode)
                .then((result) => {
                  if (!result.success) trackCheckoutError(result.errorCode)
                  return result
                })
                .finally(() => {
                  submission = undefined
                })
            }
            cb(await submission)
          },
        }
      },
      {
        name: 'slice-drys-cart',
        version: 2,
        migrate: (saved) => {
          const state = saved as Pick<
            ICartState,
            'cart' | 'totalPrice' | 'totalProducts'
          > & {
            checkout?: {
              key: string
              submitted: boolean
              referralCode?: string
            }
          }
          const key =
            state.checkout?.key ??
            (state.cart.itemList?.length ? newCheckoutKey() : undefined)
          return {
            ...state,
            // Version 1 rotated the key on any meaningful edit. When its
            // submitted flag survives, the stored cart is its original payload.
            checkout: key
              ? {
                  key,
                  input: state.checkout?.submitted
                    ? buildOrderInput(
                        state.cart,
                        key,
                        state.checkout.referralCode,
                      )
                    : undefined,
                }
              : undefined,
          }
        },
        partialize: (state) => ({
          cart: state.cart,
          checkout: state.checkout,
          totalPrice: state.totalPrice,
          totalProducts: state.totalProducts,
        }),
      },
    ),
  ),
)
