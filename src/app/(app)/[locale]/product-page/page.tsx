import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/client/ui/accordion'
import { accordions } from './consts'
import { cn } from '@/utils/cn'

export default function ProductPage() {
  return (
    <main className="container px-5 font-poppins lg:px-0">
      <section className="mb-20 mt-[6.25rem] flex border border-light_gray">
        <div className="w-1/2">Images</div>

        <div className="w-1/2">
          <h2
            className={cn(
              'relative -translate-y-[1px] translate-x-[1px] bg-black py-2 pr-6 text-[2.5rem] font-black text-white',
              'before:absolute before:-left-6 before:top-0 before:h-full before:w-6 before:bg-black before:content-[""]',
            )}
          >
            <div className="absolute right-0 top-0 mr-6 bg-red px-[0.625rem] text-base font-semibold leading-[24px]">
              В наявності
            </div>
            Курка сушена
          </h2>

          <div className="text-xl">
            <p className="pt-3">
              Сушене куряче м'ясо, приготоване з ретельно відібраних спецій та
              трав. Ідеальний перекус для активних людей та поціновувачів
              натуральних продуктів.
            </p>

            <div className="flex gap-8 pt-12">
              <h3 className="font-bold">Склад:</h3>

              <p>
                куряче м’ясо, суміш перців, суміш пряних трав, сіль кухонна.
                Допускається білий наліт у вигляді солі.
              </p>
            </div>
          </div>

          <div>Weight</div>
          <div>Price</div>
          <div>Cert badges</div>
        </div>
      </section>

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
                  <dt className="min-w-48 font-bold sm:min-w-60">
                    {field.label}
                  </dt>
                  <dd className="sm:min-w-40">{field.value}</dd>
                </section>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </main>
  )
}
