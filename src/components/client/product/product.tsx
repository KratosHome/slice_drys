'use client'
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import Image from 'next/image'
import Button from '@/components/client/ui/button'
import { useLocale } from 'next-intl'
import { transliterate } from '@/utils/transliterate'

interface ProductProps {
  product: IProduct
}
const Product: React.FC<ProductProps> = ({ product }) => {
  const locale = useLocale() as ILocale

  const [selectedVariable, setSelectedVariable] = useState(product.variables[0])

  const handleAddToCart = () => {
    const productInfo = {
      id: product._id,
      name: product.name,
      count: 0,
      price: 0,
    }
    console.log('Продукт додано до кошика:', productInfo)
  }

  const handleVariableChange = (value: string) => {
    const selected = product.variables.find(
      (variable) => variable._id === value,
    )
    if (selected) {
      setSelectedVariable(selected)
    }
  }

  return (
    <Link
      href={`${locale}/${transliterate(product.name)}?weight=${selectedVariable.weight}`}
    >
      <CardContainer className="relative h-full w-full rounded-sm">
        <CardBody className="mb-[20px] flex h-full w-full flex-col items-center justify-between gap-4">
          <div className="flex w-full justify-between text-white">
            <CardItem translateZ={30} className="flex flex-col gap-1">
              {product.statusLabel.includes('new') && (
                <div className="z-10 rounded-sm bg-[#07C70D] px-2 py-1">
                  Новинка
                </div>
              )}
              {product.statusLabel.includes('sale') && (
                <div className="z-10 bg-[#A90909] px-2 py-1">Акція</div>
              )}
              {product.statusLabel.includes('top') && (
                <div className="rounded-sm bg-[#EC9006] px-2 py-1">ТОП</div>
              )}
            </CardItem>
            {selectedVariable.count === 0 && (
              <CardItem
                translateZ={30}
                className="h-max rounded-sm bg-[#7D7D7D] px-2 py-1"
              >
                Очікуйте скоро будк!
              </CardItem>
            )}
          </div>
          <CardItem
            translateZ={70}
            className="z-2 relative grid max-w-[229px] grow-0 place-content-center px-2 py-8"
          >
            <Image
              src={product.img!}
              alt={product.name}
              width={229}
              height={229}
              className="relative aspect-square h-full w-full object-contain"
            />
          </CardItem>
          <div className="flex w-full items-center justify-between gap-2">
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
                  defaultValue={product.variables[0]._id}
                >
                  <SelectTrigger className="w-[150px] border-none shadow-none outline-none">
                    <SelectValue
                      placeholder={selectedVariable.weight.toString()}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {product.variables.map((variable) => (
                        <SelectItem key={variable._id} value={variable._id}>
                          {variable.weight} {variable.currency}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </CardItem>
          </div>
          <div className="flex w-full justify-between">
            <CardItem translateZ={30}>
              <div className="text-xs font-semibold text-[#7D7D7D] line-through sm:text-sm md:text-base lg:text-lg xl:text-lg">
                {selectedVariable.newPrice} {selectedVariable.currency}
              </div>
              <div className="text-sm font-semibold sm:text-base lg:text-lg xl:text-xl">
                {selectedVariable.price} {selectedVariable.currency}
              </div>
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
                  До кошика
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
