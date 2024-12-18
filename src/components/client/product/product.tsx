import React, { useState } from 'react'
import { IProductLocal, IVariableProduct } from '@/types/product'
import Image from 'next/image'
import Button from '@/components/client/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { useLocale } from 'next-intl'

interface ProductProps {
  product: IProductLocal
  variables: IVariableProduct[]
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const locale = useLocale()
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0)
  const selectedPrice = product.variables[selectedWeightIndex].price
  const selectedNewPrice = product?.variables[selectedWeightIndex].newPrice ?? 0
  const productName: string =
    product.name?.[locale as keyof typeof product.name] || 'Назва недоступна'

  return (
    <CardContainer className="inter-var h-full w-full rounded-sm">
      <CardBody className="group/card relative mb-[20px] flex h-full w-full flex-col items-center justify-between gap-4 p-2">
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1 text-[11px] font-medium text-white sm:text-xs lg:text-sm xl:text-base">
          {product.statusLabel?.includes('top') && (
            <CardItem
              translateZ={30}
              className="icon-top relative z-10 flex w-fit items-center rounded-sm bg-[#EC9006] px-2 py-[2px] uppercase"
            >
              ТОП
            </CardItem>
          )}
          {product.statusLabel?.includes('new') && (
            <CardItem
              translateZ={30}
              className="icon-new relative z-10 flex w-fit items-center rounded-sm bg-[#07C70D] px-2 py-[2px] uppercase"
            >
              Новинка
            </CardItem>
          )}
          {product.statusLabel?.includes('sale') && (
            <CardItem
              translateZ={30}
              className="icon-sale relative z-10 flex w-fit items-center rounded-sm bg-[#A90909] px-2 py-[2px] uppercase"
            >
              Акція
            </CardItem>
          )}
        </div>
        <CardItem
          translateZ={70}
          className="z-2 relative grid max-w-[229px] grow-0 place-content-center px-2 py-8"
        >
          <Image
            src={product.img ?? ''}
            alt={productName}
            width={229}
            height={229}
            className="relative aspect-square h-full w-full object-contain"
          />
        </CardItem>
        <div>Visited: {product.visited}</div>
        <div className="flex w-full items-center justify-between gap-2">
          <CardItem translateZ={50}>
            <h3 className="text-xs font-medium uppercase sm:text-sm md:text-base lg:text-lg xl:text-xl">
              {productName}
            </h3>
          </CardItem>
          <CardItem
            translateZ={20}
            className="sm:text-md flex w-[80px] shrink-0 items-center text-nowrap text-base font-medium sm:w-[90px] md:w-[100px] md:text-lg xl:text-xl"
          >
            <Select
              onValueChange={(value) => setSelectedWeightIndex(Number(value))}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={`${product.variables[selectedWeightIndex].weight} г`}
                />
              </SelectTrigger>
              <SelectContent>
                {product.variables.map((weight, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {weight.weight} г
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardItem>
        </div>
        <div className="flex w-full items-end justify-between gap-2">
          <CardItem translateZ={20}>
            {selectedNewPrice ? (
              <>
                {selectedPrice && (
                  <p className="text-xs font-semibold text-[#7D7D7D] line-through sm:text-sm md:text-base lg:text-lg xl:text-lg">
                    {selectedPrice} грн
                  </p>
                )}
                <p className="text-sm font-semibold sm:text-base lg:text-lg xl:text-xl">
                  {selectedNewPrice} грн
                </p>
              </>
            ) : (
              selectedPrice && (
                <p className="text-sm font-semibold sm:text-base lg:text-lg xl:text-xl">
                  {selectedPrice} грн
                </p>
              )
            )}
          </CardItem>
          <CardItem translateZ={40}>
            <Button type="button" variant="button">
              До кошика
            </Button>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  )
}

export default Product
