import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/client/ui/accordion'
import { infoAccordions } from './consts'

export const Accordions = ({
  nutritions,
}: {
  nutritions: INutritionalValue
}) => {
  const nutritionsAccordion = {
    title: 'Поживна (харчова) цінність на 100 г продукту',
    fields: [
      { label: 'Білки', value: nutritions.proteins + ' г' },
      { label: 'Жири', value: nutritions.fats + ' г' },
      {
        label: 'Вуглеводи',
        value: nutritions.carbohydrates + ' г',
      },
      {
        label: 'Енергетична цінність',
        value: nutritions.energyValue + ' г',
      },
    ],
  }

  const accordions = infoAccordions.toSpliced(1, 0, nutritionsAccordion)

  return (
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
  )
}
