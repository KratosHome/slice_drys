import assert from 'node:assert/strict'
import { describe, test } from 'node:test'

import {
  formatOrderPhoneInput,
  isValidOrderPhone,
  normalizeOrderPhone,
} from './order-contact'

describe('order phone validation', () => {
  test('normalizes complete Ukrainian phone numbers in supported formats', () => {
    for (const value of [
      '+380631234567',
      '380631234567',
      '0631234567',
      '+38 (063) 123 45 67',
      '+38 (063) 123-45-67',
      '(063) 123-45-67',
      '  +380 63 123 45 67  ',
      '+38\u00a0(063)\u00a0123\u00a045\u00a067',
    ]) {
      assert.equal(normalizeOrderPhone(value), '+380631234567', value)
      assert.equal(isValidOrderPhone(value), true, value)
    }
  })

  test('rejects truncated, malformed and non-Ukrainian phone numbers', () => {
    for (const value of [
      undefined,
      null,
      380631234567,
      '',
      ' ',
      '+38 (0',
      '+38 (063)',
      '+38 (063) 123 45 6',
      '+38063123456',
      '+3806312345678',
      '063123456',
      '06312345678',
      '+38063123abc4567',
      '+380631234567 ext 1',
      '++380631234567',
      '380+631234567',
      '+0631234567',
      '+48631234567',
      '+380001234567',
      '0000000000',
      '+38 (063 123 45 67',
      '+38 )063( 123 45 67',
      '+38 ((063)) 123 45 67',
      '+38 (063) (123) 45 67',
      `${' '.repeat(51)}+380631234567${' '.repeat(51)}extra`,
    ]) {
      assert.equal(normalizeOrderPhone(value), undefined, String(value))
      assert.equal(isValidOrderPhone(value), false, String(value))
    }
  })

  test('formats recognized Ukrainian numbers and supports incremental typing', () => {
    for (const value of [
      '0631234567',
      '380631234567',
      '+380631234567',
      '+38 (063) 123-45-67',
    ]) {
      assert.equal(formatOrderPhoneInput(value), '+38 (063) 123 45 67')
    }
    assert.equal(formatOrderPhoneInput(''), '')
    assert.equal(formatOrderPhoneInput('+3'), '+3')
    assert.equal(formatOrderPhoneInput('+38'), '+38')
    assert.equal(formatOrderPhoneInput('0'), '+38 (0')
    assert.equal(formatOrderPhoneInput('+38 (06'), '+38 (06')
    assert.equal(formatOrderPhoneInput('+38 (0631'), '+38 (063) 1')
  })

  test('never turns invalid pasted input into a different valid phone number', () => {
    for (const value of [
      '+481234567890',
      '+3806312345678',
      '06312345678',
      'abc+380631234567',
      '+38063123abc4567',
      '++380631234567',
      '380+631234567',
      '+0631234567',
      '+38 ((063)) 123 45 67',
      '+38 (063 123 45 67',
    ]) {
      assert.equal(formatOrderPhoneInput(value), value, value)
      assert.equal(
        isValidOrderPhone(formatOrderPhoneInput(value)),
        false,
        value,
      )
    }
  })
})
