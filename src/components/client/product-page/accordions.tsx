import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  CardIcon,
  ChequeIcon,
  PaperIcon,
} from '@/components/client/product-page/icons'
import { getTranslations } from 'next-intl/server'
import { ResponsiveMotion } from '@/components/client/responsive-motion'

export const Accordions = async () => {
  const t = await getTranslations('product')

  return (
    <Accordion
      multiple
      defaultValue={['info']}
      className="mx-auto mb-20 grid max-w-[988px] gap-6"
    >
      <AccordionItem value={'info'}>
        <ResponsiveMotion
          whileHover={{ scale: 1.009 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <AccordionTrigger className="py-6">
            {t('shelf-life')}
          </AccordionTrigger>
        </ResponsiveMotion>
        <AccordionContent className="gap-6 border border-t-0 p-6">
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {t('storage-conditions')}
            </dt>
            <dd className="sm:min-w-40">
              {t('at-temperatures-from-relative-humidity')}
            </dd>
          </section>
          <section className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {t('expiration-date')}
            </dt>
            <dd className="sm:min-w-40">
              {t('months-from-the-date-manufacture-indicated-packaging')}
            </dd>
          </section>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value={'delivery'}>
        <ResponsiveMotion
          whileHover={{ scale: 1.009 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <AccordionTrigger className="py-6">{t('delivery')}</AccordionTrigger>
        </ResponsiveMotion>
        <AccordionContent className="gap-6 border border-t-0 p-6">
          <div className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {t('delivery-ukraine')}
            </dt>
            <dd className="sm:min-w-40">
              {t(
                'we-offer-fast-and-reliable-delivery-of-our-products-throughout-ukraine-using-nova-poshta-after-placing-an-order-we-ship-it-within',
              )}
              <b> {t('1-2-business-days')}</b>.{' '}
              {t('delivery-time-depends-on-your-location-and-usually-takes')}{' '}
              <b>{t('1-3-days')}.</b>
            </dd>
          </div>
          <div className="flex flex-wrap gap-5 sm:flex-nowrap">
            <dt className="min-w-48 font-bold sm:min-w-60">
              {t('payment-methods')}
            </dt>
            <dd className="sm:min-w-40">
              <p>
                {t('we-offer')}
                <b> {t('several-convenient-payment-options')}:</b>
              </p>
              <ul className="grid gap-3 pt-3">
                <li className="flex items-center gap-4">
                  <CardIcon />{' '}
                  {t(
                    'online-payment-by-card-visa-mastercard-through-secure-payment-system',
                  )}
                </li>

                <li className="flex items-center gap-4">
                  <ChequeIcon />{' '}
                  {t(
                    'cash-on-delivery-payment-upon-receipt-nova-poshta-branch',
                  )}
                </li>

                <li className="flex items-center gap-4">
                  <PaperIcon />{' '}
                  {t('cashless-payment-for-corporate-clients-and-large-orders')}
                </li>
              </ul>
            </dd>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
