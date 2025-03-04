'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/client/ui/doodle-select'
import { CertIcons, Curve, MinusIcon, NewIcon, PlusIcon } from './icons'
import SliderWithThumbnails from './slider'
import { mockSliders } from './consts'
import TopLabel from '@/components/client/labels/top-label'
import NewLabel from '@/components/client/labels/new-label'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

export const ProductInfo = ({ product }: { product: IProduct }) => {
  const { name, statusLabel, description, composition, variables } = product

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

  return (
    <section className="lg:border-light_gray mb-20 flex flex-col gap-10 pb-10 lg:flex-row lg:border">
      <div className="absolute grid gap-0.5">
        <TopLabel />
        <NewLabel />
      </div>

      <div className="flex justify-center lg:w-1/2">
        <SliderWithThumbnails images={mockSliders} />
      </div>

      <div className="lg:w-1/2">
        <h1 className="bg-black py-2 pl-3 text-white">{name}</h1>
        <div className="mt-6 pb-14 sm:mt-3 sm:text-xl sm:leading-8">
          <p>{description}</p>
          <div className="flex gap-2 pt-8 sm:gap-8">
            <h3 className="font-bold">Склад:</h3>
            <p>{composition.join(', ')}</p>
          </div>
        </div>
        <div className="relative flex items-center justify-center gap-6 pb-[3.75rem] sm:justify-start">
          <Select>
            <SelectTrigger className="relative">
              <label
                htmlFor="weight"
                className="text-dark_gray absolute -top-6 left-0 text-base font-normal"
              >
                Обрати вагу
              </label>
              <SelectValue placeholder="Вага" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Вага</SelectLabel>
                {variables.map((variable) => (
                  <SelectItem
                    key={variable.weight}
                    value={String(variable.weight)}
                  >
                    {variable.weight} г
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="bg-light_gray content-center rounded-sm border px-8 py-2 text-2xl font-medium">
            {variables[0].weight} г
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-10 pb-8 text-2xl font-bold sm:flex-row sm:pb-16">
          <div>
            {variables[0].price} {variables[0].currency}
          </div>

          <div className="flex items-stretch gap-4 pr-4">
            <div className="flex items-center gap-5 bg-black px-2.5 font-bold text-white">
              <button>
                <MinusIcon />
              </button>
              {variables[0].count}
              <button>
                <PlusIcon />
              </button>
            </div>

            <button
              type="button"
              className="text-nowrap bg-red-500 px-9 py-2.5 text-xl font-semibold tracking-wider text-white hover:grayscale-[10%]"
            >
              До кошика
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
