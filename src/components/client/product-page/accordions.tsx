import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/client/ui/accordion'
import { infoAccordions } from './consts'
import 'quill/dist/quill.snow.css'
import { FC } from 'react'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

interface AccordionsProps {
  nutritions: INutritionalValue
  description: string
}

export const Accordions: FC<AccordionsProps> = ({
  nutritions,
  description,
}) => {
  // Аккордіон для поживної цінності
  const nutritionsAccordion = {
    title: 'Поживна (харчова) цінність на 100 г продукту',
    fields: [
      { label: 'Білки', value: nutritions.proteins + ' г' },
      { label: 'Жири', value: nutritions.fats + ' г' },
      { label: 'Вуглеводи', value: nutritions.carbohydrates + ' г' },
      { label: 'Енергетична цінність', value: nutritions.energyValue + ' г' },
    ],
  }

  const firstAccordion = infoAccordions[0]
  const thirdAccordion = infoAccordions[1]

  const content = JSON.parse(description)
  const converter = new QuillDeltaToHtmlConverter(content.ops)
  const html = converter.convert()

  return (
    <Accordion
      type="multiple"
      defaultValue={['info', 'about', 'nutrition']}
      className="mx-auto grid max-w-[988px] gap-6"
    >
      <AccordionItem value="about">
        <AccordionTrigger>Про товар</AccordionTrigger>
        <AccordionContent className="border border-t-0">
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <article
              id="editor"
              className="ql-editor prose lg:prose-xl"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </section>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value={'nutrition'}>
        <AccordionTrigger>{nutritionsAccordion.title}</AccordionTrigger>
        <AccordionContent>
          {/* Вивід всіх 4 полів */}
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {nutritionsAccordion.fields[0].label}
            </dt>
            <dd className="sm:min-w-40">
              {nutritionsAccordion.fields[0].value}
            </dd>
          </section>
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {nutritionsAccordion.fields[1].label}
            </dt>
            <dd className="sm:min-w-40">
              {nutritionsAccordion.fields[1].value}
            </dd>
          </section>
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {nutritionsAccordion.fields[2].label}
            </dt>
            <dd className="sm:min-w-40">
              {nutritionsAccordion.fields[2].value}
            </dd>
          </section>
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {nutritionsAccordion.fields[3].label}
            </dt>
            <dd className="sm:min-w-40">
              {nutritionsAccordion.fields[3].value}
            </dd>
          </section>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value={'info'}>
        <AccordionTrigger>{firstAccordion.title}</AccordionTrigger>
        <AccordionContent>
          {/* Приклад виведення двох полів (додайте, якщо їх більше) */}
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {firstAccordion.fields[0].label}
            </dt>
            <dd className="sm:min-w-40">{firstAccordion.fields[0].value}</dd>
          </section>
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {firstAccordion.fields[1].label}
            </dt>
            <dd className="sm:min-w-40">{firstAccordion.fields[1].value}</dd>
          </section>
        </AccordionContent>
      </AccordionItem>

      {/* Третій акордіон */}
      <AccordionItem value={thirdAccordion.title}>
        <AccordionTrigger>{thirdAccordion.title}</AccordionTrigger>
        <AccordionContent>
          {/* Приклад виведення двох полів (доповніть за потребою) */}
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {thirdAccordion.fields[0].label}
            </dt>
            <dd className="sm:min-w-40">{thirdAccordion.fields[0].value}</dd>
          </section>
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {thirdAccordion.fields[1].label}
            </dt>
            <dd className="sm:min-w-40">{thirdAccordion.fields[1].value}</dd>
          </section>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
