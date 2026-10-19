'use client'

import { useLocale, useTranslations } from 'next-intl'
import {
  calculatePackNutrient,
  formatEnergyValue,
  formatNutrient,
  parseNutritionValue,
} from '@/utils/product-nutrition'
import { useProductVariant } from './product-variant-provider'

const nutrients = ['proteins', 'fats', 'carbohydrates'] as const

export function ProductNutrition({
  nutrition,
  variant = 'cards',
}: {
  nutrition?: INutritionalValue | null
  variant?: 'cards' | 'compact'
}) {
  const t = useTranslations('product')
  const locale = useLocale()
  const { weight } = useProductVariant()
  const energyUnit =
    nutrition?.energyUnit === 'kcal' || nutrition?.energyUnit === 'kJ'
      ? nutrition.energyUnit
      : undefined
  const grams =
    Number.isFinite(weight) && weight > 0
      ? new Intl.NumberFormat(locale).format(weight)
      : t('nutrition-no-data')

  if (variant === 'compact') {
    const baseEnergy = formatEnergyValue(nutrition?.energyValue, locale)
    const packEnergy = energyUnit
      ? formatEnergyValue(
          calculatePackNutrient(nutrition?.energyValue, weight),
          locale,
        )
      : undefined
    const energyLabel = (value: string | undefined) =>
      !energyUnit || value === undefined
        ? t('nutrition-no-data')
        : `${value} ${t(energyUnit)}`

    return (
      <section
        className="min-w-0 rounded-lg border border-current/12 px-4 py-4 lg:rounded-none lg:border-0 lg:border-l lg:border-current/10 lg:py-0 lg:pr-0 lg:pl-5"
        aria-live="polite"
        aria-atomic="true"
      >
        <table className="w-full table-fixed border-collapse text-sm lg:text-[13px]">
          <caption className="px-0 pt-0 pb-3 text-left text-[15px] font-semibold">
            <h2>{t('nutritional-value')}</h2>
          </caption>
          <colgroup>
            <col className="w-[40%]" />
            <col className="w-[30%]" />
            <col className="w-[30%]" />
          </colgroup>
          <thead>
            <tr className="text-muted-foreground border-b border-current/8 text-[11px] leading-normal lg:text-xs">
              <th scope="col" className="px-0 py-1.5 text-left font-normal">
                <span className="sr-only">{t('nutritional-value')}</span>
              </th>
              <th
                scope="col"
                className="py-1.5 pr-0 pl-2 text-right align-bottom font-normal wrap-anywhere"
              >
                {t('nutrition-per-100')}
              </th>
              <th
                scope="col"
                className="py-1.5 pr-0 pl-2 text-right align-bottom font-normal wrap-anywhere"
              >
                {t('nutrition-per-pack', { grams })}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-current/8">
            {nutrients.map((nutrient) => (
              <tr key={nutrient}>
                <th
                  scope="row"
                  className="px-0 py-2 text-left align-top font-medium wrap-anywhere"
                >
                  {t(nutrient)}
                </th>
                {[
                  parseNutritionValue(nutrition?.[nutrient]),
                  calculatePackNutrient(nutrition?.[nutrient], weight),
                ].map((value, index) => (
                  <td
                    key={index}
                    className="py-2 pr-0 pl-2 text-right align-top wrap-anywhere tabular-nums last:font-semibold"
                  >
                    {formatNutrient(value, locale, t('g')) ??
                      t('nutrition-no-data')}
                  </td>
                ))}
              </tr>
            ))}
            {energyUnit ? (
              <tr>
                <th
                  scope="row"
                  className="px-0 py-2 text-left align-top font-medium wrap-anywhere"
                >
                  {t('energy')}
                </th>
                <td className="py-2 pr-0 pl-2 text-right align-top wrap-anywhere tabular-nums">
                  {energyLabel(baseEnergy)}
                </td>
                <td className="py-2 pr-0 pl-2 text-right align-top font-semibold wrap-anywhere tabular-nums">
                  {energyLabel(packEnergy)}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
        {!energyUnit ? (
          <div className="text-muted-foreground grid gap-1 border-t border-current/8 px-0 pt-3 text-xs leading-relaxed wrap-anywhere">
            <p>
              {t('energy-value-per-100')}:{' '}
              {t('energy-unit-unverified', {
                value: baseEnergy ?? t('nutrition-no-data'),
              })}
            </p>
            <p>
              {t('nutrition-per-pack', { grams })}: {t('energy-pack-pending')}
            </p>
          </div>
        ) : null}
      </section>
    )
  }

  return (
    <div
      className="my-6 grid min-w-0 gap-6 sm:grid-cols-2"
      aria-live="polite"
      aria-atomic="true"
    >
      {(['base', 'pack'] as const).map((basis) => {
        const energyValue = formatEnergyValue(
          basis === 'base'
            ? nutrition?.energyValue
            : energyUnit
              ? calculatePackNutrient(nutrition?.energyValue, weight)
              : undefined,
          locale,
        )

        return (
          <section key={basis} className="min-w-0 rounded-sm border p-4">
            <h3 className="mb-4 text-lg font-bold">
              {basis === 'base'
                ? t('nutrition-per-100')
                : t('nutrition-per-pack', { grams })}
            </h3>
            <dl className="grid gap-3">
              {nutrients.map((nutrient) => {
                const value =
                  basis === 'base'
                    ? parseNutritionValue(nutrition?.[nutrient])
                    : calculatePackNutrient(nutrition?.[nutrient], weight)

                return (
                  <div
                    key={nutrient}
                    className="flex flex-wrap justify-between gap-x-3 gap-y-1"
                  >
                    <dt className="font-bold">{t(nutrient)}</dt>
                    <dd className="min-w-0 text-right wrap-anywhere">
                      {formatNutrient(value, locale, t('g')) ??
                        t('nutrition-no-data')}
                    </dd>
                  </div>
                )
              })}
            </dl>
            <p className="text-muted-foreground mt-5 text-sm wrap-anywhere">
              {basis === 'base' ? t('energy-value-per-100') : t('energy-value')}
              :{' '}
              {energyUnit
                ? energyValue === undefined
                  ? t('nutrition-no-data')
                  : `${energyValue} ${t(energyUnit)}`
                : basis === 'base'
                  ? t('energy-unit-unverified', {
                      value: energyValue ?? t('nutrition-no-data'),
                    })
                  : t('energy-pack-pending')}
            </p>
          </section>
        )
      })}
    </div>
  )
}
