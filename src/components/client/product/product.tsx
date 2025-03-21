'use client'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/client/ui/select'
import Link from 'next/link'
import {
  CardBody,
  CardContainer,
  CardItem,
} from '@/components/client/ui/3d-card'
import Image from 'next/image'
import Button from '@/components/client/ui/button'
import { useLocale, useTranslations } from 'next-intl'
import { useCartStore } from '@/store/cartStore'
import TopLabel from '@/components/client/labels/top-label'
import NewLabel from '@/components/client/labels/new-label'
import SaleLabel from '@/components/client/labels/sale-label'

interface ProductProps {
  product: IProduct
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const locale = useLocale() as ILocale
  const t = useTranslations('product')

  const [mounted, setMounted] = useState(false)

  const { addItemToCart, setOpenCart, hasItemInCart } = useCartStore(
    (state) => state,
  )

  const [selectedVariable, setSelectedVariable] = useState(
    product.variant ?? product.variables[0],
  )

  const isInCart = hasItemInCart(product._id as string, selectedVariable.weight)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = () => {
    if (product._id && product.img)
      addItemToCart({
        id: product._id,
        quantity: 1,
        image: product.img,
        name: product.name,
        price: selectedVariable.newPrice || selectedVariable.price,
        weight: selectedVariable.weight,
        maxQuantity: selectedVariable.count,
      })
    setOpenCart(true)
  }

  const handleVariableChange = (value: number | string) => {
    const selected = product.variables.find(
      (variable) => variable._id === value,
    )
    if (selected) {
      setSelectedVariable(selected)
    }
  }

  return (
    <Link
      href={`/${locale}/meat/${product.slug.toLowerCase()}?weight=${selectedVariable.weight}`}
      className="block px-2 py-8 sm:px-3 md:px-4"
    >
      <CardContainer className="relative h-full w-full rounded-sm">
        <CardBody className="relative mb-[20px] flex h-full w-full flex-col items-center justify-between gap-4">
          <div className="absolute left-0 top-0 z-10 flex flex-col gap-1 text-[11px] font-medium text-white sm:text-xs lg:text-sm xl:text-base">
            {product.statusLabel?.includes('top') && <TopLabel />}
            {product.statusLabel?.includes('new') && <NewLabel />}
            {product.statusLabel?.includes('sale') && (
              <CardItem translateZ={30}>
                <SaleLabel />
              </CardItem>
            )}
          </div>
          <CardItem
            translateZ={70}
            className="z-2 relative grid max-w-[229px] grow-0 place-content-center px-2 pb-2 pt-8 sm:pb-8"
          >
            <Image
              src={product.img!}
              alt={product.name}
              width={229}
              height={229}
              className="relative aspect-square h-full w-full object-contain"
            />
          </CardItem>
          {selectedVariable.count > 0 && <div className="h-6 sm:hidden"></div>}
          {selectedVariable.count === 0 && (
            <CardItem
              translateZ={30}
              className="relative flex w-fit items-center rounded-sm bg-[#7D7D7D] px-2 py-1 !text-[11px] font-medium text-white sm:absolute sm:right-0 sm:top-0 sm:text-xs lg:text-sm"
            >
              {t('expect_soon')}
            </CardItem>
          )}
          <div className="flex w-full items-start justify-between gap-2">
            <CardItem
              translateZ={50}
              className="text-xs font-medium uppercase sm:text-sm md:text-base lg:text-lg xl:text-xl"
            >
              {product.name}
            </CardItem>
            <CardItem translateZ={60}>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <Select
                  onValueChange={handleVariableChange}
                  value={String(selectedVariable._id)}
                >
                  <SelectTrigger className="w-fit border-none shadow-none outline-none">
                    <SelectValue
                      placeholder={selectedVariable.weight.toString()}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {product.variables.map((variable) => (
                        <SelectItem
                          key={variable._id}
                          value={String(variable._id)}
                        >
                          {variable.weight} г
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardItem>
          </div>
          <div className="flex w-full items-end justify-between">
            <CardItem translateZ={30}>
              {selectedVariable.newPrice ? (
                <>
                  {selectedVariable.price && (
                    <p className="text-xs font-semibold text-[#7D7D7D] line-through sm:text-sm md:text-base lg:text-lg xl:text-lg">
                      {selectedVariable.price} {selectedVariable.currency}
                    </p>
                  )}
                  <p className="text-sm font-semibold sm:text-base lg:text-lg xl:text-xl">
                    {selectedVariable.newPrice} {selectedVariable.currency}
                  </p>
                </>
              ) : (
                selectedVariable.price && (
                  <p className="text-sm font-semibold sm:text-base lg:text-lg xl:text-xl">
                    {selectedVariable.price} {selectedVariable.currency}
                  </p>
                )
              )}
            </CardItem>
            <CardItem translateZ={80}>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
                }}
              >
                <Button
                  className="!z-50"
                  type="button"
                  variant="button"
                  onClick={handleAddToCart}
                >
                  {mounted
                    ? isInCart
                      ? t('in_cart')
                      : t('add_to_cart')
                    : t('add_to_cart')}
                </Button>
              </div>
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
    </Link>
  )
}

export default Product
