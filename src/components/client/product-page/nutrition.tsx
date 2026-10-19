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
}: {
  nutrition?: INutritionalValue | null
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
