import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/client/ui/accordion'
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
import { accordions } from './consts'
import { CertIcons, Curve, MinusIcon, PlusIcon } from './icons'
import SliderWithThumbnails from './slider'

const images = ['/sliders/meat.png', '/sliders/fruit.png', '/sliders/promo.png']

export const ProductInfo = () => (
  <section className="mb-20 mt-10 flex flex-col gap-10 pb-10 lg:mt-[6.25rem] lg:flex-row lg:border lg:border-light_gray">
    <div className="absolute grid gap-0.5">
      <TopLabel />
      <NewLabel />
    </div>

    <div className="flex justify-center lg:w-1/2">
      <SliderWithThumbnails images={images} />
    </div>

    <div className="lg:w-1/2">
      <Title />
      <Description />
      <WeightSelect />
      <PriceControl />
      <Certifications />
    </div>
  </section>
)

export const Title = () => {
  const InStockLabel = () => (
    <div className="absolute right-0 top-0 bg-red px-2.5 text-sm font-semibold leading-[24px] sm:mr-6 sm:text-base">
      В наявності
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
      Курка сушена
    </h2>
  )
}

export const Description = () => (
  <div className="mt-6 pb-14 sm:mt-3 sm:text-xl sm:leading-8">
    <p>
      Сушене куряче м&#39;ясо, приготоване з ретельно відібраних спецій та трав.
      Ідеальний перекус для активних людей та поціновувачів натуральних
      продуктів.
    </p>

    <div className="flex gap-2 pt-8 sm:gap-8">
      <h3 className="font-bold">Склад:</h3>

      <p>
        куряче м’ясо, суміш перців, суміш пряних трав, сіль кухонна.
        Допускається білий наліт у вигляді солі.
      </p>
    </div>
  </div>
)

export const WeightSelect = () => (
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
          <SelectItem value="30">30 г</SelectItem>
          <SelectItem value="100">100 г</SelectItem>
          <SelectItem value="200">200 г</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>

    <div className="content-center rounded-sm border bg-light_gray px-8 py-2 text-2xl font-medium">
      30 г
    </div>
  </div>
)

export const PriceControl = () => (
  <div className="flex flex-col items-center justify-between gap-10 pb-8 text-2xl font-bold sm:flex-row sm:pb-16">
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

export const Accordions = () => (
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

export const TopLabel = () => (
  <div className="flex w-fit items-center gap-2.5 rounded-[2px] bg-orange px-2 py-0.5 text-[0.6875rem] font-medium text-white sm:text-base">
    <svg
      className="h-[16px] w-[16px] sm:h-[24px] sm:w-[24px]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clipPath="url(#clip0_2798_6)">
        <path
          d="M17.3604 20H6C4.89543 20 4 19.1046 4 18V10H7.92963C8.59834 10 9.2228 9.6658 9.59373 9.1094L12.1094 5.3359C12.6658 4.5013 13.6025 4 14.6056 4H14.8195C15.4375 4 15.9075 4.55487 15.8059 5.1644L15 10H18.5604C19.8225 10 20.7691 11.1547 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20Z"
          stroke="#FBFBFB"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 10V20" stroke="#FBFBFB" />
      </g>
      <defs>
        <clipPath id="clip0_2798_6">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
    <div className="pt-0.5">ТОП</div>
  </div>
)

export const NewLabel = () => (
  <div className="flex items-center gap-2.5 rounded-[2px] bg-green px-2 py-0.5 text-[0.6875rem] font-medium text-white sm:text-base">
    <svg
      className="h-[16px] w-[16px] sm:h-[24px] sm:w-[24px]"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g clipPath="url(#clip0_2798_15401)">
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
      </g>
      <defs>
        <clipPath id="clip0_2798_15401">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
    <div className="pt-1">Новинка</div>
  </div>
)
