import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/client/ui/accordion'
import { accordions } from './consts'

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
