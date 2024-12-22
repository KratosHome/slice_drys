'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/client/ui/accordion'
import { accordions } from './consts'
import { cn } from '@/utils/cn'
import { PlusIcon, MinusIcon, Curve, CertIcons } from './icons'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/client/ui/select'
import { Splide, SplideSlide, SplideTrack } from '@splidejs/react-splide'

import '@splidejs/react-splide/css'

export default function ProductPage() {
  return (
    <main className="container px-5 font-poppins lg:px-0">
      <section className="mb-20 mt-[6.25rem] flex border border-light_gray pb-10">
        <div className="w-1/2">
          <Splide aria-label="My Favorite Images">
            <SplideSlide>
              <img src="/sliders/meat.png" alt="Image 1" />
            </SplideSlide>
            <SplideSlide>
              <img src="/sliders/fruit.png" alt="Image 2" />
            </SplideSlide>
            <SplideSlide>
              <img src="/sliders/fruit.png" alt="Image 2" />
            </SplideSlide>
          </Splide>
        </div>

        <div className="w-1/2">
          <Title />
          <Description />
          <WeightSelect />
          <PriceControl />
          <Certs />
        </div>
      </section>

      <Accordions />
    </main>
  )
}

const Accordions = () => (
  <Accordion type="multiple" className="mx-auto grid max-w-[988px] gap-6">
    {accordions.map((accordion) => (
      <AccordionItem value={accordion.title} key={accordion.title}>
        <AccordionTrigger>{accordion.title}</AccordionTrigger>

        <AccordionContent>
          {accordion.fields.map((field) => (
            <section
              key={field.label}
              className="flex flex-wrap gap-5 sm:flex-nowrap"
            >
              <dt className="min-w-48 font-bold sm:min-w-60">{field.label}</dt>
              <dd className="sm:min-w-40">{field.value}</dd>
            </section>
          ))}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
)

const Title = () => (
  <h2
    className={cn(
      'relative -translate-y-[1px] translate-x-[1px] bg-black py-2 pr-6 text-[2.5rem] font-black text-white',
      'before:absolute before:-left-6 before:top-0 before:h-full before:w-6 before:translate-x-[1px] before:bg-black before:content-[""]',
    )}
  >
    <div className="absolute right-0 top-0 mr-6 bg-red px-2.5 text-base font-semibold leading-[24px]">
      В наявності
    </div>
    Курка сушена
  </h2>
)

const Description = () => (
  <div className="pb-14 text-xl leading-8">
    <p className="pt-3">
      Сушене куряче м&#39;ясо, приготоване з ретельно відібраних спецій та трав.
      Ідеальний перекус для активних людей та поціновувачів натуральних
      продуктів.
    </p>

    <div className="flex gap-8 pt-8">
      <h3 className="font-bold">Склад:</h3>

      <p>
        куряче м’ясо, суміш перців, суміш пряних трав, сіль кухонна.
        Допускається білий наліт у вигляді солі.
      </p>
    </div>
  </div>
)

const WeightSelect = () => (
  <div className="relative flex items-center gap-6 pb-[3.75rem]">
    <label htmlFor="weight" className="absolute -top-6 text-dark_gray">
      Обрати вагу
    </label>

    <Select>
      <SelectTrigger className="">
        <SelectValue placeholder="Вага" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <div className="content-center rounded-sm border bg-light_gray px-8 py-2 text-2xl font-medium">
      30 г
    </div>
  </div>
)

const PriceControl = () => (
  <div className="flex items-center justify-between pb-16 text-2xl font-bold">
    <div>130 грн.</div>

    <div className="flex items-stretch gap-4 pr-4">
      <div className="flex items-center gap-5 bg-black px-2.5 font-bold text-white">
        <button>
          <MinusIcon />
        </button>
        1
        <button>
          <PlusIcon />
        </button>
      </div>

      <button
        type="button"
        className="bg-red px-9 py-2.5 text-xl font-semibold tracking-wider text-white hover:grayscale-[10%]"
      >
        До кошика
      </button>
    </div>
  </div>
)

const Certs = () => (
  <div className="flex flex-col items-end justify-end gap-4 px-4">
    <CertIcons />
    <Curve />
  </div>
)
