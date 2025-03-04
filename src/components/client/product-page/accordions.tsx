'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/client/ui/accordion'
import 'quill/dist/quill.snow.css'
import { FC } from 'react'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'
import {
  CardIcon,
  ChequeIcon,
  PaperIcon,
} from '@/components/client/product-page/icons'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

interface AccordionsProps {
  nutrition: INutritionalValue
  description: string
}

export const Accordions: FC<AccordionsProps> = ({ nutrition, description }) => {
  const t = useTranslations('product')

  const content = JSON.parse(description)
  const converter = new QuillDeltaToHtmlConverter(content.ops)
  const html = converter.convert()

  return (
    <Accordion
      type="multiple"
      defaultValue={['info', 'about', 'nutrition']}
      className="mx-auto mb-[230px] grid max-w-[988px] gap-6"
    >
      <AccordionItem value="about">
        <motion.div
          whileHover={{ scale: 1.009 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <AccordionTrigger className="py-6">
            {t('about_product')}
          </AccordionTrigger>
        </motion.div>
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
        <motion.div
          whileHover={{ scale: 1.009 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <AccordionTrigger className="py-6">
            {t('nutritional_value')}
          </AccordionTrigger>
        </motion.div>
        <AccordionContent className="border border-t-0">
          <section className="my-6 grid grid-cols-1 justify-items-center gap-4 md:grid-cols-2">
            <div className="flex w-full max-w-[290px] justify-between">
              <span className="font-bold">{t('proteins')}</span>
              <span>{nutrition.proteins} г</span>
            </div>
            <div className="flex w-full max-w-[290px] justify-between">
              <span className="font-bold">{t('fats')}</span>
              <span>{nutrition.fats} г</span>
            </div>
            <div className="flex w-full max-w-[290px] justify-between">
              <span className="font-bold">{t('carbohydrates')}</span>
              <span>{nutrition.carbohydrates} г</span>
            </div>
            <div className="flex w-full max-w-[290px] justify-between">
              <span className="font-bold">Енергетична цінність</span>
              <span>{nutrition.energyValue} г</span>
            </div>
          </section>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value={'info'}>
        <motion.div
          whileHover={{ scale: 1.009 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <AccordionTrigger className="py-6">
            {t('shelf_life')}
          </AccordionTrigger>
        </motion.div>
        <AccordionContent className="gap-6 border border-t-0 p-6">
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {t('storage_conditions')}
            </dt>
            <dd className="sm:min-w-40">
              {t('at_temperatures_from_relative_humidity')}
            </dd>
          </section>
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {t('expiration_date')}
            </dt>
            <dd className="sm:min-w-40">
              {t('months_from_the_date_manufacture_indicated_packaging')}
            </dd>
          </section>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value={'delivery'}>
        <motion.div
          whileHover={{ scale: 1.009 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <AccordionTrigger className="py-6">{t('delivery')}</AccordionTrigger>
        </motion.div>
        <AccordionContent className="gap-6 border border-t-0 p-6">
          <div className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {t('delivery_ukraine')}
            </dt>
            <dd className="sm:min-w-40">
              Ми пропонуємо швидку та надійну доставку нашої продукції по всій
              території України за допомогою Нової Пошти. Після оформлення
              замовлення, ми відправляємо його протягом
              <b> 1-2 робочих днів</b>. Термін доставки залежить від вашого
              місцезнаходження та зазвичай займає <b>1-3 дні.</b>
            </dd>
          </div>
          <div className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">Способи оплати</dt>
            <dd className="sm:min-w-40">
              <p>
                Ми пропонуємо
                <b> кілька зручних варіантів оплати:</b>
              </p>
              <ul className="grid gap-3 pt-3">
                <li className="flex items-center gap-4">
                  <CardIcon /> Онлайн-оплата карткою (Visa/Mastercard) через
                  безпечну платіжну систему.
                </li>

                <li className="flex items-center gap-4">
                  <ChequeIcon /> Накладений платіж (оплата при отриманні) у
                  відділенні Нової Пошти.
                </li>

                <li className="flex items-center gap-4">
                  <PaperIcon /> Безготівковий розрахунок для корпоративних
                  клієнтів та великих замовлень.
                </li>
              </ul>
            </dd>
          </div>
          <div className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              Вартість доставки
            </dt>
            <dd className="sm:min-w-40">
              Доставка розраховується згідно з тарифами Нової Пошти і
              оплачується клієнтом при отриманні замовлення.
              <b>
                {' '}
                При замовленні на суму від 1000 грн - доставка безкоштовна!
              </b>
            </dd>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
