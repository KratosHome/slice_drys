'use client'
import React, { useEffect, useState, useSyncExternalStore } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/doodle-select'
import ChangeQuantityIcon from '@/components/icons/change-quantity-icon'
import TopLabel from '@/components/client/labels/top-label'
import NewLabel from '@/components/client/labels/new-label'
import { useCartStore } from '@/store/cart-store'
import SaleLabel from '@/components/client/labels/sale-label'
import { useTranslations } from 'next-intl'
import { increaseProductVisit } from '@/server/products/increase-product-visit.server'
import { Button } from '@/components/ui/button'
import { ResponsiveMotion } from '@/components/client/responsive-motion'
import { MIN_ORDER_AMOUNT } from '@/constants/order'
import { getProductPrice, isProductPriceReduced } from '@/utils/product-price'
import { productVariantUrl } from '@/utils/product-variant'
import { useProductView } from '@/hooks/useProductView'
import { useProductVariant } from './product-variant-provider'

const subscribeToHydration = () => () => undefined

export const ProductInfo = ({
  product,
  imageGallery,
  nutritionContent,
}: {
  product: IProduct
  imageGallery: React.ReactNode
  nutritionContent?: React.ReactNode
}) => {
  const t = useTranslations('product')
  const tCart = useTranslations('cart')
  const { name, composition, variables } = product

  const selectedVariable = useProductVariant()
  const price = getProductPrice(selectedVariable)
  useProductView(product, selectedVariable)

  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  )

  const { addItemToCart, setOpenCart, hasItemInCart } = useCartStore(
    (state) => state,
  )

  const [quantity, setQuantity] = useState(1)

  const isInCart =
    mounted && hasItemInCart(product._id as string, selectedVariable.weight)

  useEffect(() => {
    const visitKey = `product-visit:${product.slug}`
    if (window.sessionStorage.getItem(visitKey)) return

    const recordVisit = () => {
      window.sessionStorage.setItem(visitKey, '1')
      void increaseProductVisit(product.slug)
    }

    if (typeof window.requestIdleCallback === 'function') {
      const idleCallbackId = window.requestIdleCallback(recordVisit, {
        timeout: 2_000,
      })
      return () => window.cancelIdleCallback(idleCallbackId)
    }

    const timeoutId = window.setTimeout(recordVisit, 1_500)
    return () => window.clearTimeout(timeoutId)
  }, [product.slug])

  const handleAddToCart = () => {
    if (
      product._id &&
      product.img &&
      price !== undefined &&
      selectedVariable.count > 0
    ) {
      addItemToCart({
        id: product._id,
        quantity: quantity,
        image: product.img,
        name: product.name,
        price,
        weight: selectedVariable.weight,
        maxQuantity: selectedVariable.count,
      })
    }
    setOpenCart(true)
  }

  const handleWeightChange = (value: string) => {
    const newVariable = variables.find((v) => String(v.weight) === value)
    if (newVariable) {
      setQuantity(1)
      const currentUrl = `${window.location.pathname}${window.location.search}`
      window.history.replaceState(
        null,
        '',
        productVariantUrl(currentUrl, newVariable.weight) +
          window.location.hash,
      )
    }
  }

  return (
    <section className="relative mb-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
      <div className="absolute top-0 left-0 z-10 grid gap-0.5">
        {product.statusLabel?.includes('top') && <TopLabel />}
        {product.statusLabel?.includes('new') && <NewLabel />}
        {product.statusLabel?.includes('sale') && <SaleLabel />}
      </div>
      {imageGallery}
      <div className="grid min-w-0 grid-cols-1 gap-y-6 lg:w-[56%] lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <h1 className="relative order-1 text-[30px] leading-tight font-semibold tracking-tight sm:text-[36px] lg:col-span-2 xl:text-[40px]">
          <span className="text-muted-foreground mb-2 block text-xs font-medium tracking-[0.16em] uppercase">
            {t('dried-jerky')}
          </span>
          {name}{' '}
          <span className="text-muted-foreground inline-block align-middle text-lg font-normal tracking-normal whitespace-nowrap sm:text-xl">
            / {selectedVariable.weight}&nbsp;{t('g')}.
          </span>
          {selectedVariable.count === 0 && (
            <span className="mt-3 block w-fit rounded-sm bg-red-700 px-2 py-1 text-xs font-medium tracking-normal text-white">
              {t('expect-soon')}
            </span>
          )}
        </h1>
        <section className="lg:border-foreground/10 lg:bg-foreground/[0.025] order-2 min-w-0 lg:col-start-1 lg:row-start-2 lg:rounded-l-xl lg:border lg:border-r-0 lg:p-5">
          <h2 className="text-muted-foreground mb-3 text-xs font-medium tracking-[0.12em] uppercase">
            {t('composition')}
          </h2>
          <p className="text-sm leading-6 wrap-anywhere sm:text-base">
            {composition.join(', ')}
          </p>
        </section>
        <div className="border-foreground/10 order-3 min-w-0 border-t pt-5 lg:col-span-2 lg:row-start-3 lg:border-0 lg:pt-0">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div className="relative pt-6">
              <Select
                value={String(selectedVariable.weight)}
                onValueChange={(value) => {
                  if (value !== null) handleWeightChange(value)
                }}
              >
                <SelectTrigger
                  id="weight"
                  className="border-foreground/15 relative h-[52px] min-w-28 rounded-lg bg-transparent text-xl font-medium shadow-none"
                >
                  <label
                    htmlFor="weight"
                    className="text-muted-foreground absolute -top-6 left-0 text-sm font-normal"
                  >
                    {t('choose-weight')}
                  </label>
                  <SelectValue placeholder={t('weight')}>
                    {selectedVariable.weight} {t('g')}.
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-grey-select">
                  <SelectGroup>
                    <SelectLabel>{t('weight')}</SelectLabel>
                    {variables.map((variable) => (
                      <SelectItem
                        key={variable.weight}
                        value={String(variable.weight)}
                      >
                        {variable.weight} {t('g')}.
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="text-right font-bold whitespace-nowrap">
              {isProductPriceReduced(selectedVariable) ? (
                <>
                  {selectedVariable.price && (
                    <p className="text-muted-foreground text-sm font-medium line-through">
                      {selectedVariable.price} {selectedVariable.currency}
                    </p>
                  )}
                  <p className="text-2xl font-bold sm:text-[28px]">
                    {price} {selectedVariable.currency}
                  </p>
                </>
              ) : (
                price !== undefined && (
                  <p className="text-2xl font-bold sm:text-[28px]">
                    {price} {selectedVariable.currency}
                  </p>
                )
              )}
            </div>
          </div>
          <div className="flex items-stretch gap-3 text-lg font-semibold">
            <div className="border-foreground/15 flex h-[52px] min-w-28 items-center justify-between rounded-lg border px-2.5 font-medium">
              <ResponsiveMotion
                className="cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() =>
                  setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                }
              >
                <ChangeQuantityIcon
                  content="-"
                  aria-label={t('remove')}
                  disabled={quantity === 1}
                  aria-disabled={quantity === 1}
                />
              </ResponsiveMotion>
              <div className="min-w-4 text-center">{quantity}</div>
              <ResponsiveMotion
                className="cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() =>
                  setQuantity((prev) =>
                    prev < selectedVariable.count ? prev + 1 : prev,
                  )
                }
              >
                <ChangeQuantityIcon content="+" aria-label={t('add')} />
              </ResponsiveMotion>
            </div>
            <Button
              aria-label={isInCart ? t('in-cart') : t('add-to-cart')}
              className="h-[52px] min-w-0 flex-1 rounded-lg text-lg font-semibold"
              type="button"
              variant="danger"
              disabled={selectedVariable.count <= 0 || price === undefined}
              onClick={handleAddToCart}
            >
              {mounted
                ? isInCart
                  ? t('in-cart')
                  : t('add-to-cart')
                : t('add-to-cart')}
            </Button>
          </div>
          <p className="text-muted-foreground mt-4 text-xs leading-5 sm:text-sm">
            {tCart('minimum-order-amount')} {MIN_ORDER_AMOUNT} {tCart('uah')}.
          </p>
        </div>
        {nutritionContent && (
          <div className="lg:border-foreground/10 lg:bg-foreground/[0.025] order-4 min-w-0 lg:col-start-2 lg:row-start-2 lg:rounded-r-xl lg:border lg:border-l-0 lg:p-5 lg:pl-0">
            {nutritionContent}
          </div>
        )}
        <div className="order-5 flex w-fit items-center gap-4 opacity-75 lg:col-span-2">
          <svg className="h-12 w-12">
            <use href="/icons/sprite-sertif.svg#haccp_certified" />
          </svg>
          <svg className="h-12 w-12">
            <use href="/icons/sprite-sertif.svg#gluten_free" />
          </svg>
          <svg className="h-12 w-12">
            <use href="/icons/sprite-sertif.svg#non_gmo" />
          </svg>
          <svg className="h-12 w-12">
            <use href="/icons/sprite-sertif.svg#sugar_free" />
          </svg>
        </div>
      </div>
    </section>
  )
}
