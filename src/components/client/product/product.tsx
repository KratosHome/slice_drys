'use client'
import React, { useState } from 'react'
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

interface ProductProps {
  product: IProduct
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const locale = useLocale() as ILocale
  const t = useTranslations('product')

  const { addItemToCart, setOpenCart } = useCartStore((state) => state)

  const [selectedVariable, setSelectedVariable] = useState(
    product.variant ?? product.variables[0],
  )

  const handleAddToCart = () => {
    if (product._id && product.img)
      addItemToCart({
        id: product._id,
        quantity: 1,
        image: product.img,
        name: product.name,
        price: selectedVariable.price,
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
      href={`${locale}/products/${product.slug}?weight=${selectedVariable.weight}`}
      className="block px-2 py-8 sm:px-3 md:px-4"
    >
      <CardContainer className="relative h-full w-full rounded-sm">
        <CardBody className="relative mb-[20px] flex h-full w-full flex-col items-center justify-between gap-4">
          <div className="absolute left-0 top-0 z-10 flex flex-col gap-1 text-[11px] font-medium text-white sm:text-xs lg:text-sm xl:text-base">
            {product.statusLabel?.includes('top') && (
              <CardItem
                translateZ={30}
                className="relative z-10 flex w-fit items-center gap-2 rounded-sm bg-[#EC9006] px-2 py-[2px] uppercase"
              >
                <svg
                  className="md:h-6 md:w-6"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.3604 20H6C4.89543 20 4 19.1046 4 18V10H7.92963C8.59834 10 9.2228 9.6658 9.59373 9.1094L12.1094 5.3359C12.6658 4.5013 13.6025 4 14.6056 4H14.8195C15.4375 4 15.9075 4.55487 15.8059 5.1644L15 10H18.5604C19.8225 10 20.7691 11.1547 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20Z"
                    stroke="#FBFBFB"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M8 10V20" stroke="#FBFBFB" />
                </svg>
                <p className="mt-[2px]">{t('top')}</p>
              </CardItem>
            )}
            {product.statusLabel?.includes('new') && (
              <CardItem
                translateZ={30}
                className="relative z-10 flex w-fit items-center gap-2 rounded-sm bg-[#07C70D] px-2 py-[2px] uppercase"
              >
                <svg
                  className="md:h-6 md:w-6"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5858 4.58579C12.2107 4.21071 11.702 4 11.1716 4H4V11.1716C4 11.702 4.21071 12.2107 4.58579 12.5858L11.5858 19.5858C12.3668 20.3668 13.6332 20.3668 14.4142 19.5858L19.5858 14.4142C20.3668 13.6332 20.3668 12.3668 19.5858 11.5858L12.5858 4.58579Z"
                    stroke="#FBFBFB"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="9"
                    y="9"
                    width="0.01"
                    height="0.01"
                    stroke="#FBFBFB"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-[2px]">{t('novelty')}</p>
              </CardItem>
            )}
            {product.statusLabel?.includes('sale') && (
              <CardItem
                translateZ={30}
                className="relative z-10 flex w-fit items-center gap-2 rounded-sm bg-[#A90909] px-2 py-[2px] uppercase"
              >
                <svg
                  className="md:h-6 md:w-6"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5099 3.66452C11.3048 2.77651 12.6952 2.77651 13.4901 3.66452L14.1909 4.44729C14.596 4.89986 15.1849 5.14377 15.7914 5.11024L16.8404 5.05225C18.0304 4.98646 19.0135 5.96956 18.9477 7.1596L18.8898 8.20861C18.8562 8.81511 19.1001 9.40398 19.5527 9.80913L20.3355 10.5099C21.2235 11.3048 21.2235 12.6952 20.3355 13.4901L19.5527 14.1909C19.1001 14.596 18.8562 15.1849 18.8898 15.7914L18.9477 16.8404C19.0135 18.0304 18.0304 19.0135 16.8404 18.9477L15.7914 18.8898C15.1849 18.8562 14.596 19.1001 14.1909 19.5527L13.4901 20.3355C12.6952 21.2235 11.3048 21.2235 10.5099 20.3355L9.80913 19.5527C9.40398 19.1001 8.81511 18.8562 8.20861 18.8898L7.1596 18.9477C5.96956 19.0135 4.98646 18.0304 5.05225 16.8404L5.11024 15.7914C5.14377 15.1849 4.89986 14.596 4.44729 14.1909L3.66452 13.4901C2.77651 12.6952 2.77651 11.3048 3.66452 10.5099L4.44729 9.80913C4.89986 9.40398 5.14377 8.81511 5.11024 8.20861L5.05225 7.1596C4.98646 5.96956 5.96956 4.98646 7.1596 5.05225L8.20861 5.11024C8.81511 5.14377 9.40398 4.89986 9.80913 4.44729L10.5099 3.66452Z"
                    stroke="#FBFBFB"
                  />
                  <rect
                    x="9.5"
                    y="9.5"
                    width="0.01"
                    height="0.01"
                    stroke="#FBFBFB"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="14.5"
                    y="14.5"
                    width="0.01"
                    height="0.01"
                    stroke="#FBFBFB"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 9L9 15"
                    stroke="#FBFBFB"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-[2px]">{t('sale')}</p>
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
              <div onClick={(e) => e.stopPropagation()}>
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
                  {t('add_to_cart')}
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
