import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/client/ui/select'
import { cn } from '@/utils/cn'
import {
  CertIcons,
  Curve,
  MinusIcon,
  NewIcon,
  PlusIcon,
  TopIcon,
} from './icons'
import SliderWithThumbnails from './slider'
import { mockProduct, mockSliders } from './consts'

export const ProductInfo = () => (
  <section className="mb-20 mt-10 flex flex-col gap-10 pb-10 lg:mt-[6.25rem] lg:flex-row lg:border lg:border-light_gray">
    <div className="absolute grid gap-0.5">
      <TopLabel />
      <NewLabel />
    </div>

    <div className="flex justify-center lg:w-1/2">
      <SliderWithThumbnails images={mockSliders} />
    </div>

    <div className="lg:w-1/2">
      <Title name={mockProduct.name} statusLabel={mockProduct.statusLabel} />
      <Description
        description={mockProduct.description}
        composition={mockProduct.composition}
      />
      <WeightSelect variables={mockProduct.variables} />
      <PriceControl variables={mockProduct.variables} />
      <Certifications />
    </div>
  </section>
)

export const Title = ({
  name,
  statusLabel,
}: {
  name: string
  statusLabel: string[]
}) => {
  const InStockLabel = () => (
    <div className="absolute right-0 top-0 bg-red px-2.5 text-sm font-semibold leading-[24px] sm:mr-6 sm:text-base">
      {statusLabel.join(', ')}
    </div>
  )

  return (
    <h2
      className={cn(
        'relative -translate-y-[1px] translate-x-[1px] bg-black py-2 pl-3 text-[1.5rem] font-black text-white sm:text-[2.5rem] lg:pl-0',
        'before:absolute before:-left-6 before:top-0 before:h-full before:translate-x-[1px] before:bg-black before:content-[""] lg:before:w-6',
      )}
    >
      <InStockLabel />
      {name}
    </h2>
  )
}

export const Description = ({
  description,
  composition,
}: {
  description: string
  composition: string[]
}) => (
  <div className="mt-6 pb-14 sm:mt-3 sm:text-xl sm:leading-8">
    <p>{description}</p>
    <div className="flex gap-2 pt-8 sm:gap-8">
      <h3 className="font-bold">Склад:</h3>
      <p>{composition.join(', ')}</p>
    </div>
  </div>
)

export const WeightSelect = ({
  variables,
}: {
  variables: { weight: number; price: number }[]
}) => (
  <div className="relative flex items-center justify-center gap-6 pb-[3.75rem] sm:justify-start">
    <Select>
      <SelectTrigger className="relative">
        <label
          htmlFor="weight"
          className="absolute -top-6 left-0 text-base font-normal text-dark_gray"
        >
          Обрати вагу
        </label>
        <SelectValue placeholder="Вага" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Вага</SelectLabel>
          {variables.map((variable) => (
            <SelectItem key={variable.weight} value={String(variable.weight)}>
              {variable.weight} г
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>

    <div className="content-center rounded-sm border bg-light_gray px-8 py-2 text-2xl font-medium">
      {variables[0].weight} г
    </div>
  </div>
)

export const PriceControl = ({
  variables,
}: {
  variables: { price: number; currency: string; count: number }[]
}) => (
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
        className="text-nowrap bg-red px-9 py-2.5 text-xl font-semibold tracking-wider text-white hover:grayscale-[10%]"
      >
        До кошика
      </button>
    </div>
  </div>
)

export const Certifications = () => (
  <div className="flex flex-col items-center gap-4 px-4 sm:items-end sm:justify-end">
    <CertIcons />
    <Curve />
  </div>
)

export const TopLabel = () => (
  <div className="flex w-fit items-center gap-2.5 rounded-[2px] bg-orange px-2 py-0.5 text-[0.6875rem] font-medium text-white sm:text-base">
    <TopIcon />
    <div className="pt-0.5">ТОП</div>
  </div>
)

export const NewLabel = () => (
  <div className="flex items-center gap-2.5 rounded-[2px] bg-green px-2 py-0.5 text-[0.6875rem] font-medium text-white sm:text-base">
    <NewIcon />
    <div className="pt-1">Новинка</div>
  </div>
)
