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
import { useSearchParams } from 'next/navigation'
import { increaseProductVisit } from '@/server/products/increase-product-visit.server'
import { Button } from '@/components/ui/button'
import { ResponsiveMotion } from '@/components/client/responsive-motion'
import UnderlineWave from '@/components/ui/underline-wave'
import { MIN_ORDER_AMOUNT } from '@/constants/order'
import { getProductPrice, isProductPriceReduced } from '@/utils/product-price'
import { getProductVariant, productVariantUrl } from '@/utils/product-variant'
import { useProductView } from '@/hooks/useProductView'

const subscribeToHydration = () => () => undefined

export const ProductInfo = ({
  product,
  imageGallery,
}: {
  product: IProduct
  imageGallery: React.ReactNode
}) => {
  const t = useTranslations('product')
  const tCart = useTranslations('cart')
  const searchParams = useSearchParams()

  const weightParam = searchParams.get('weight')

  const { name, composition, variables } = product

  const selectedVariable = getProductVariant(product, weightParam)
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
    <section className="lg:border-light_gray mb-20 flex flex-col gap-10 pb-10 lg:flex-row lg:border">
      <div className="absolute grid gap-0.5">
        {product.statusLabel?.includes('top') && <TopLabel />}
        {product.statusLabel?.includes('new') && <NewLabel />}
        {product.statusLabel?.includes('sale') && <SaleLabel />}
      </div>
      {imageGallery}
      <div className="lg:w-1/2">
        <h1 className="bg-foreground text-background relative py-2 pl-3 text-[40px] font-bold">
          {t('dried-jerky')} {name} {selectedVariable.weight}&nbsp;{t('g')}.
          {selectedVariable.count === 0 && (
            <div className="flex w-fit items-center bg-red-700 px-2 py-1 text-[11px]! font-medium text-white sm:absolute sm:top-0 sm:right-8 sm:text-xs lg:text-sm">
              {t('expect-soon')}
            </div>
          )}
        </h1>
        <div className="mt-6 pb-14 sm:mt-3 sm:text-xl sm:leading-8">
          <div className="flex gap-2">
            <p className="font-bold">{t('composition')}:</p>
            <p>{composition.join(', ')}</p>
          </div>
        </div>
        <div className="relative flex items-stretch justify-center gap-6 pb-[3.75rem] sm:justify-start">
          <Select
            value={String(selectedVariable.weight)}
            onValueChange={(value) => {
              if (value !== null) handleWeightChange(value)
            }}
          >
            <SelectTrigger id="weight" className="relative">
              <label
                htmlFor="weight"
                className="absolute -top-6 left-0 text-base font-normal text-[#7d7d7d]"
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
          <div className="bg-grey-select content-center rounded-sm border px-8 py-2 text-2xl font-medium">
            {selectedVariable.weight} {t('g')}.
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-10 pb-8 text-2xl font-bold sm:flex-row sm:pb-16">
          <div className="w-full text-center whitespace-nowrap md:w-max">
            {isProductPriceReduced(selectedVariable) ? (
              <>
                {selectedVariable.price && (
                  <p className="text-xs font-semibold text-[#7D7D7D] line-through sm:text-sm md:text-base lg:text-lg xl:text-lg">
                    {selectedVariable.price} {selectedVariable.currency}
                  </p>
                )}
                <p className="text-sm font-semibold sm:text-base lg:text-lg xl:text-xl">
                  {price} {selectedVariable.currency}
                </p>
              </>
            ) : (
              price !== undefined && (
                <p className="text-sm font-semibold sm:text-base lg:text-lg xl:text-xl">
                  {price} {selectedVariable.currency}
                </p>
              )
            )}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pr-4 md:items-stretch">
            <div className="bg-foreground text-background flex h-[50px] min-w-[115px] items-center justify-between px-2.5 font-bold">
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
              className="h-[50px] min-w-[190px] rounded-none"
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
        </div>
        <p className="text-sm text-[#7D7D7D]">
          {tCart('minimum-order-amount')} {MIN_ORDER_AMOUNT} {tCart('uah')}.
        </p>
        <div className="relative ml-auto flex w-fit items-stretch justify-end gap-2 pt-5 pr-5 pb-4">
          <svg className="-mt-2.5 h-[65px] w-[65px]">
            <use href="/icons/sprite-sertif.svg#haccp_certified" />
          </svg>
          <svg className="h-[65px] w-[65px]">
            <use href="/icons/sprite-sertif.svg#gluten_free" />
          </svg>
          <svg className="h-[65px] w-[65px]">
            <use href="/icons/sprite-sertif.svg#non_gmo" />
          </svg>
          <svg className="h-[65px] w-[65px]">
            <use href="/icons/sprite-sertif.svg#sugar_free" />
          </svg>
          <UnderlineWave />
        </div>
      </div>
    </section>
  )
}
