'use client'

import WeightSelector from './weight-selector'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import Image from 'next/image'
import TopLabel from '@/components/client/labels/top-label'
import NewLabel from '@/components/client/labels/new-label'
import SaleLabel from '@/components/client/labels/sale-label'
import { NativeButton as Button } from '@/components/ui/native-button'
import { TransitionLink } from '@/components/client/transition-link'

import { useState, useSyncExternalStore } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useCartStore } from '@/store/cart-store'
import { getProductPrice, isProductPriceReduced } from '@/utils/product-price'
import { getProductVariant, productVariantUrl } from '@/utils/product-variant'
import { trackProductSelection } from '@/utils/analytics'

interface IProductProps {
  product: IProductCard
  priority?: boolean
  initialVariant?: IVariableProduct
  analyticsList?: { id: string; name: string; index?: number }
}

const subscribeToHydration = () => () => undefined

export default function Product({
  product,
  priority = false,
  initialVariant,
  analyticsList,
}: IProductProps) {
  const locale = useLocale() as ILocale
  const t = useTranslations('product')

  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  )

  const addItemToCart = useCartStore((state) => state.addItemToCart)
  const setOpenCart = useCartStore((state) => state.setOpenCart)

  const [selectedVariable, setSelectedVariable] = useState(
    getProductVariant(product, String(initialVariant?.weight ?? '')),
  )
  const price = getProductPrice(selectedVariable)

  const isInCart = useCartStore(
    (state) =>
      state.cart.itemList?.some(
        (item) =>
          item.id === product._id && item.weight === selectedVariable.weight,
      ) ?? false,
  )

  const handleAddToCart = (): void => {
    if (
      product._id &&
      product.img &&
      price !== undefined &&
      selectedVariable.count > 0
    )
      addItemToCart({
        id: product._id,
        quantity: 1,
        image: product.img,
        name: product.name,
        price,
        weight: selectedVariable.weight,
        maxQuantity: selectedVariable.count,
      })
    setOpenCart(true)
  }

  const handleVariableChange = (value: number | string): void => {
    const selected: IVariableProduct | undefined = product.variables.find(
      (variable) => String(variable.weight) === String(value),
    )
    if (selected) setSelectedVariable(selected)
  }

  const productHref = productVariantUrl(
    `/${locale}/products/${product.category}/product/${product.slug.toLowerCase()}`,
    selectedVariable.weight,
  )
  const handleSelection = () =>
    trackProductSelection(product, selectedVariable, analyticsList)

  return (
    <div className="block px-2 py-8 sm:px-3 md:px-4">
      <CardContainer className="relative h-full w-full rounded-sm">
        <CardBody className="relative flex h-full w-full flex-col items-center justify-between md:mb-[20px] md:gap-4">
          <div className="pointer-events-none absolute top-0 left-0 z-10 flex flex-col gap-1 text-[11px] font-medium text-white sm:text-xs lg:text-sm xl:text-base">
            {product.statusLabel?.includes('top') ? <TopLabel /> : null}
            {product.statusLabel?.includes('new') ? <NewLabel /> : null}
            {product.statusLabel?.includes('sale') ? (
              <CardItem translateZ={30}>
                <SaleLabel />
              </CardItem>
            ) : null}
          </div>
          <TransitionLink
            href={productHref}
            onClick={handleSelection}
            aria-label={`${product.name}, ${selectedVariable.weight} ${t('g')}`}
            className="block rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
          >
            <CardItem
              translateZ={70}
              className="relative z-2 grid h-[229px] w-[140px] place-content-center md:w-[229px]"
            >
              <Image
                src={product.img!}
                alt={product.name}
                className="relative aspect-square h-full w-full"
                sizes="(max-width: 767px) 140px, 229px"
                fill
                priority={priority}
                quality={50}
                style={{
                  objectFit: 'contain',
                }}
              />
            </CardItem>
          </TransitionLink>
          {selectedVariable.count > 0 ? (
            <div className="h-6 sm:hidden" />
          ) : null}
          {selectedVariable.count === 0 ? (
            <CardItem
              translateZ={30}
              className="relative flex w-fit items-center rounded-sm bg-[#7D7D7D] px-2 py-1 text-[11px]! font-medium text-white sm:absolute sm:top-0 sm:right-0 sm:text-xs lg:text-sm"
            >
              {t('expect-soon')}
            </CardItem>
          ) : null}
          <div className="relative z-20 flex w-full items-start justify-between gap-2">
            <CardItem
              translateZ={50}
              className="text-xs font-medium uppercase sm:text-sm md:text-base lg:text-lg xl:text-xl"
            >
              <TransitionLink
                href={productHref}
                onClick={handleSelection}
                className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
              >
                {product.name}
              </TransitionLink>
            </CardItem>
            <CardItem className="pointer-events-auto relative z-20">
              <WeightSelector
                variables={product.variables}
                weight={selectedVariable.weight}
                unit={t('g')}
                label={t('choose-weight')}
                onValueChange={handleVariableChange}
              />
            </CardItem>
          </div>
          <div className="relative z-20 flex w-full items-end justify-between">
            <CardItem translateZ={30}>
              {isProductPriceReduced(selectedVariable) ? (
                <>
                  {selectedVariable.price ? (
                    <p className="text-xs font-semibold text-[#7D7D7D] line-through sm:text-sm md:text-base lg:text-lg xl:text-lg">
                      {selectedVariable.price} {selectedVariable.currency}
                    </p>
                  ) : null}
                  <p className="text-sm font-semibold sm:text-base lg:text-lg xl:text-xl">
                    {price} {selectedVariable.currency}
                  </p>
                </>
              ) : price !== undefined ? (
                <p className="text-sm font-semibold sm:text-base lg:text-lg xl:text-xl">
                  {price} {selectedVariable.currency}
                </p>
              ) : null}
            </CardItem>
            <CardItem className="pointer-events-auto relative z-20">
              <Button
                className="z-50!"
                type="button"
                variant="button"
                disabled={selectedVariable.count <= 0 || price === undefined}
                onClick={handleAddToCart}
              >
                {mounted
                  ? isInCart
                    ? t('in-cart')
                    : t('add-to-cart')
                  : t('add-to-cart')}
              </Button>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </div>
  )
}
