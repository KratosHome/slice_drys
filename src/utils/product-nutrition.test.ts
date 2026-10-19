import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import {
  calculatePackNutrient,
  formatEnergyValue,
  formatNutrient,
  parseNutritionValue,
} from './product-nutrition'

describe('product nutrition values', () => {
  test('parses nonnegative label values without changing decimal precision', () => {
    for (const value of [20, '20', ' 20 ', '20.123456', '20,123456']) {
      assert.equal(
        parseNutritionValue(value),
        Number(String(value).replace(',', '.')),
      )
    }
    assert.equal(parseNutritionValue(0), 0)
    assert.equal(parseNutritionValue('0,0'), 0)
    assert.equal(parseNutritionValue(-0), 0)
  })

  test('does not coerce absent or malformed label values to zero', () => {
    for (const value of [
      undefined,
      null,
      '',
      '   ',
      false,
      true,
      [],
      {},
      -1,
      '-1',
      NaN,
      Infinity,
      -Infinity,
      'Infinity',
      'NaN',
      '12 g',
      '12.3.4',
      '12,3.4',
      '0x10',
      '1e2',
    ]) {
      assert.equal(parseNutritionValue(value), undefined, String(value))
    }
  })

  test('scales the original per-100-g value for every supported pack', () => {
    for (const [weight, amount] of [
      [30, 6],
      [50, 10],
      [100, 20],
      [150, 30],
    ]) {
      assert.equal(calculatePackNutrient('20', weight), amount)
    }
    assert.equal(calculatePackNutrient(0, 30), 0)
    assert.equal(calculatePackNutrient('20,123456', 150), 30.185184)
    assert.equal(calculatePackNutrient(1e-7, 150), 1.5e-7)
    assert.equal(calculatePackNutrient(1e21, 30), 3e20)
    assert.equal(calculatePackNutrient(20, 12.5), 2.5)
  })

  test('rejects invalid weights, missing nutrients and nonfinite results', () => {
    for (const weight of [0, -30, NaN, Infinity, -Infinity]) {
      assert.equal(calculatePackNutrient(20, weight), undefined)
    }
    assert.equal(calculatePackNutrient(undefined, 30), undefined)
    assert.equal(calculatePackNutrient('not available', 30), undefined)
    assert.equal(calculatePackNutrient(Number.MAX_VALUE, 150), undefined)
    assert.equal(calculatePackNutrient(Number.MAX_VALUE, 100), Number.MAX_VALUE)
  })

  test('localizes grams and rounds only the displayed value', () => {
    assert.equal(formatNutrient(20, 'uk', 'г'), '20 г')
    assert.equal(formatNutrient(20, 'en', 'g'), '20 g')
    assert.equal(formatNutrient(12.34, 'uk', 'г'), '12,3 г')
    assert.equal(formatNutrient(12.36, 'en', 'g'), '12.4 g')
    assert.equal(formatNutrient(0.1, 'uk', 'г'), '0,1 г')
    assert.equal(formatNutrient(0.09999, 'uk', 'г'), '<0,1 г')
    assert.equal(formatNutrient(0.000001, 'en', 'g'), '<0.1 g')
    assert.equal(formatNutrient(0, 'uk', 'г'), '0 г')
    assert.equal(formatNutrient(-0, 'en', 'g'), '0 g')
    for (const value of [undefined, NaN, Infinity, -1]) {
      assert.equal(formatNutrient(value, 'uk', 'г'), undefined)
    }
  })

  test('rounds fractional label values correctly at pack display ties', () => {
    for (const [base, weight, expectedAmount, uk, en] of [
      ['0.3', 150, 0.45, '0,5 г', '0.5 g'],
      ['0.7', 150, 1.05, '1,1 г', '1.1 g'],
      ['4.1', 50, 2.05, '2,1 г', '2.1 g'],
    ] as const) {
      const amount = calculatePackNutrient(base, weight)
      assert.equal(amount, expectedAmount)
      assert.equal(formatNutrient(amount, 'uk', 'г'), uk)
      assert.equal(formatNutrient(amount, 'en', 'g'), en)
      assert.equal(calculatePackNutrient(base, 100), Number(base))
    }
  })

  test('a 100 g pack retains the exact base value and its displayed rounding', () => {
    for (const base of [39.05, 20.123456]) {
      const amount = calculatePackNutrient(base, 100)
      assert.equal(amount, base)
      assert.equal(
        formatNutrient(amount, 'uk', 'г'),
        formatNutrient(base, 'uk', 'г'),
      )
      assert.equal(
        formatNutrient(amount, 'en', 'g'),
        formatNutrient(base, 'en', 'g'),
      )
    }
    assert.equal(
      formatNutrient(calculatePackNutrient('39.05', 100), 'uk', 'г'),
      '39,1 г',
    )
    assert.equal(
      formatNutrient(calculatePackNutrient('39.05', 100), 'en', 'g'),
      '39.1 g',
    )
  })

  test('repeated pack switches never accumulate display rounding or mutate the base', () => {
    const label = Object.freeze({ protein: '20.123456' })
    const expectedAmounts: Record<number, number> = {
      30: 6.0370368,
      50: 10.061728,
      100: 20.123456,
      150: 30.185184,
    }
    for (const weight of [30, 150, 50, 30, 100, 150, 100]) {
      const amount = calculatePackNutrient(label.protein, weight)
      assert.equal(amount, expectedAmounts[weight])
      formatNutrient(amount, 'uk', 'г')
    }
    assert.equal(label.protein, '20.123456')
    assert.equal(calculatePackNutrient(label.protein, 100), 20.123456)
  })

  test('formats the energy label number without assigning a unit or nutrient rounding', () => {
    assert.equal(formatEnergyValue('1234.56789', 'uk'), '1234,56789')
    assert.equal(formatEnergyValue('1234,56789', 'en'), '1234.56789')
    assert.equal(formatEnergyValue(0, 'en'), '0')
    assert.equal(formatEnergyValue(0.000001, 'en'), '0.000001')
    assert.equal(formatEnergyValue(undefined, 'uk'), undefined)
    assert.equal(formatEnergyValue('unknown', 'en'), undefined)
  })
})
