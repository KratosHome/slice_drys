'use client'
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/doodle-select'
import { MinusIcon, PlusIcon } from './icons'
import SliderWithThumbnails from './slider'
import TopLabel from '@/components/client/labels/top-label'
import NewLabel from '@/components/client/labels/new-label'
import { useCartStore } from '@/store/cartStore'
import SaleLabel from '@/components/client/labels/sale-label'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { increaseProductVisit } from '@/server/products/increase-product-visit.server'
import { Button } from '@/components/ui/button'
import { ResponsiveMotion } from '@/components/client/responsiv-motion/responsive-motion'
import UnderlineWave from '@/components/ui/underline-wave'

export const ProductInfo = ({ product }: { product: IProduct }) => {
  const router = useRouter()
  const t = useTranslations('product')
  const searchParams = useSearchParams()

  const weightParam = searchParams.get('weight')

  const { name, img, composition, variables } = product

  const initialSelectedVariable = weightParam
    ? variables.find((variable) => String(variable.weight) === weightParam) ||
      (product.variant ?? variables[0])
    : (product.variant ?? variables[0])

  const [mounted, setMounted] = useState(false)

  const { addItemToCart, setOpenCart, hasItemInCart } = useCartStore(
    (state) => state,
  )

  const [selectedVariable, setSelectedVariable] = useState(
    initialSelectedVariable,
  )

  const [quantity, setQuantity] = useState(1)

  const isInCart = hasItemInCart(product._id as string, selectedVariable.weight)

  useEffect(() => {
    const fetchData = async () => {
      await increaseProductVisit(product.slug)
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAddToCart = () => {
    if (product._id && product.img) {
      addItemToCart({
        id: product._id,
        quantity: quantity,
        image: product.img,
        name: product.name,
        price: selectedVariable.newPrice || selectedVariable.price,
        weight: selectedVariable.weight,
        maxQuantity: selectedVariable.count,
      })
    }
    setOpenCart(true)
  }

  const handleWeightChange = (value: string) => {
    const newVariable = variables.find((v) => String(v.weight) === value)
    if (newVariable) {
      setSelectedVariable(newVariable)
      setQuantity(1)
      const currentPath = window.location.pathname
      router.replace(`${currentPath}?weight=${newVariable.weight}`)
    }
  }

  return (
    <section className="lg:border-light_gray mb-20 flex flex-col gap-10 pb-10 lg:flex-row lg:border">
      <div className="absolute grid gap-0.5">
        {product.statusLabel?.includes('top') && <TopLabel />}
        <NewLabel />
        {product.statusLabel?.includes('new') && <NewLabel />}
        {product.statusLabel?.includes('sale') && <SaleLabel />}
      </div>
      <SliderWithThumbnails img={img!} />
      <div className="lg:w-1/2">
        <h1 className="relative bg-black py-2 pl-3 text-[40px] font-bold text-white">
          {t('dried-jerky')} {name} {selectedVariable.weight} {t('g')}.
          {selectedVariable.count === 0 && (
            <div className="flex w-fit items-center bg-red-700 px-2 py-1 text-[11px]! font-medium text-white sm:absolute sm:top-0 sm:right-8 sm:text-xs lg:text-sm">
              {t('expect_soon')}
            </div>
          )}
        </h1>
        <div className="mt-6 pb-14 sm:mt-3 sm:text-xl sm:leading-8">
          <div className="flex gap-2">
            <p className="font-bold">{t('composition')}:</p>
            <p>{composition.join(', ')}</p>
          </div>
        </div>
        <div className="relative flex items-center justify-center gap-6 pb-[3.75rem] sm:justify-start">
          <Select
            value={String(selectedVariable.weight)}
            onValueChange={handleWeightChange}
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
          <div className="w-full text-center whitespace-nowrap md:w-max">
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
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 pr-4 md:items-stretch">
            <div className="flex h-[50px] items-center gap-5 bg-black px-2.5 font-bold text-white">
              <ResponsiveMotion
                className="cursor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() =>
                  setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                }
              >
                <MinusIcon />
              </ResponsiveMotion>
              <div className="min-w-4 text-center">{quantity}</div>
              <ResponsiveMotion
                className="cuitrsor-pointer"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                onClick={() =>
                  setQuantity((prev) =>
                    prev < selectedVariable.count ? prev + 1 : prev,
                  )
                }
              >
                <PlusIcon />
              </ResponsiveMotion>
            </div>
            <Button
              className="h-[50px] rounded-none"
              type="button"
              variant="danger"
              disabled={selectedVariable.count === 0}
              onClick={handleAddToCart}
            >
              {mounted
                ? isInCart
                  ? t('in_cart')
                  : t('add_to_cart')
                : t('add_to_cart')}
            </Button>
          </div>
        </div>
        <div className="relative ml-auto flex w-fit justify-end gap-2 pr-5 pb-4">
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
          <UnderlineWave />
        </div>
      </div>
    </section>
  )
}
