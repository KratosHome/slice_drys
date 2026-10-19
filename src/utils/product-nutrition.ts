/** Label values are the unchanged nutrient amounts per 100 g. */
export function parseNutritionValue(value: unknown): number | undefined {
  if (typeof value === 'string') {
    const decimal = value.trim()
    if (!/^\d+(?:[.,]\d+)?$/.test(decimal)) return undefined
    value = Number(decimal.replace(',', '.'))
  }

  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    return undefined
  }

  return value === 0 ? 0 : value
}

function decimalParts(value: number): [bigint, number] {
  const [decimal, exponent = '0'] = String(value).split('e')
  const [integer, fraction = ''] = decimal.split('.')
  return [BigInt(integer + fraction), Number(exponent) - fraction.length]
}

export function calculatePackNutrient(
  value: unknown,
  weight: number,
): number | undefined {
  const base = parseNutritionValue(value)
  if (base === undefined || !Number.isFinite(weight) || weight <= 0) {
    return undefined
  }
  if (weight === 100) return base

  // Multiply decimal coefficients exactly before converting once to a number.
  // Binary intermediates can otherwise move display ties such as 4.1 × 50 / 100.
  const [baseCoefficient, baseExponent] = decimalParts(base)
  const [weightCoefficient, weightExponent] = decimalParts(weight)
  const coefficient = baseCoefficient * weightCoefficient
  const exponent = baseExponent + weightExponent - 2
  const amount = Number(`${coefficient}e${exponent}`)
  return Number.isFinite(amount) ? amount : undefined
}

export function formatNutrient(
  value: number | undefined,
  locale: string,
  gramUnit: string,
): string | undefined {
  const amount = parseNutritionValue(value)
  if (amount === undefined) return undefined

  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 1,
    useGrouping: false,
  })

  if (amount > 0 && amount < 0.1) {
    return `<${formatter.format(0.1)} ${gramUnit}`
  }

  return `${formatter.format(amount)} ${gramUnit}`
}

/** Formats label or calculated energy without assigning an energy unit. */
export function formatEnergyValue(
  value: unknown,
  locale: string,
): string | undefined {
  const amount = parseNutritionValue(value)
  if (amount === undefined) return undefined

  return new Intl.NumberFormat(locale, {
    maximumSignificantDigits: 21,
    useGrouping: false,
  }).format(amount)
}
