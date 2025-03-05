'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/client/ui/doodle-select'
import { MinusIcon, PlusIcon } from './icons'
import SliderWithThumbnails from './slider'
import TopLabel from '@/components/client/labels/top-label'
import NewLabel from '@/components/client/labels/new-label'
import { useCartStore } from '@/store/cartStore'
import { CardItem } from '@/components/client/ui/3d-card'
import SaleLabel from '@/components/client/labels/sale-label'
import Button from '@/components/client/ui/button'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

export const ProductInfo = ({ product }: { product: IProduct }) => {
  const t = useTranslations('product')

  const { name, img, composition, variables } = product

  const { addItemToCart, setOpenCart } = useCartStore((state) => state)

  const [selectedVariable, setSelectedVariable] = useState(
    product.variant ?? product.variables[0],
  )

  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    if (product._id && product.img)
      addItemToCart({
        id: product._id,
        quantity: quantity,
        image: product.img,
        name: product.name,
        price: selectedVariable.price,
        weight: selectedVariable.weight,
        maxQuantity: selectedVariable.count,
      })
    setOpenCart(true)
  }

  return (
    <section className="lg:border-light_gray mb-20 flex flex-col gap-10 pb-10 lg:flex-row lg:border">
      <div className="absolute grid gap-0.5">
        {product.statusLabel?.includes('top') && <TopLabel />}
        <NewLabel />
        {product.statusLabel?.includes('new') && <NewLabel />}
        {product.statusLabel?.includes('sale') && (
          <CardItem translateZ={30}>
            <SaleLabel />
          </CardItem>
        )}
      </div>
      <motion.div
        className="flex justify-center lg:w-1/2"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <SliderWithThumbnails img={img} images={[]} />
      </motion.div>

      <div className="lg:w-1/2">
        <h1 className="bg-black py-2 pl-3 text-[40px] font-bold text-white">
          {name}
        </h1>
        <div className="mt-6 pb-14 sm:mt-3 sm:text-xl sm:leading-8">
          <div className="flex gap-2">
            <h3 className="font-bold">{t('composition')}:</h3>
            <p>{composition.join(', ')}</p>
          </div>
        </div>
        <div className="relative flex items-center justify-center gap-6 pb-[3.75rem] sm:justify-start">
          <Select
            value={String(selectedVariable.weight)}
            onValueChange={(value: string) => {
              const newVariable = variables.find(
                (v) => String(v.weight) === value,
              )
              if (newVariable) {
                setSelectedVariable(newVariable)
                setQuantity(1)
              }
            }}
          >
            <SelectTrigger className="relative transition-transform duration-300 hover:scale-105">
              <label
                htmlFor="weight"
                className="text-dark_gray absolute -top-6 left-0 text-base font-normal text-[#7D7D7D]"
              >
                {t('choose_weight')}
              </label>
              <SelectValue placeholder={t('weight')} />
            </SelectTrigger>

            <SelectContent>
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

          <div className="bg-light_gray content-center rounded-sm border px-8 py-2 text-2xl font-medium">
            {selectedVariable.weight} {t('g')}.
          </div>
        </div>
        <div className="flex flex-col items-end justify-between gap-10 pb-8 text-2xl font-bold sm:flex-row sm:pb-16">
          <div>
            {selectedVariable.price} {selectedVariable.currency}
          </div>
          <div className="flex items-stretch gap-4 pr-4">
            <div className="flex items-center gap-5 bg-black px-2.5 font-bold text-white">
              <motion.button
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() =>
                  setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                }
              >
                <MinusIcon />
              </motion.button>
              <div className="min-w-4 text-center">{quantity}</div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() =>
                  setQuantity((prev) =>
                    prev < selectedVariable.count ? prev + 1 : prev,
                  )
                }
              >
                <PlusIcon />
              </motion.button>
            </div>
            <Button type="button" variant="danger" onClick={handleAddToCart}>
              {t('add_to_cart')}
            </Button>
          </div>
        </div>
        <div className="underline-wave relative ml-auto flex w-fit justify-end gap-2 pb-4 pr-5">
          <Image
            src={'/icons/haccp_certified.svg'}
            alt={''}
            width={80}
            height={80}
          />
          <Image
            src={'/icons/gluten_free.svg'}
            alt={''}
            width={65}
            height={65}
            className="mt-5"
          />
          <Image
            src={'/icons/non_gmo.svg'}
            alt={''}
            width={65}
            height={65}
            className="mt-5"
          />
          <Image
            src={'/icons/sugar_free.svg'}
            alt={''}
            width={65}
            height={65}
            className="mt-5"
          />
        </div>
      </div>
    </section>
  )
}
