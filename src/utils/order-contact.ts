export function normalizeOrderPhone(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined

  const phone = value.trim()
  if (!phone || phone.length > 50 || !/^\+?[\d ()\-\u00a0]+$/.test(phone)) {
    return undefined
  }

  // Permit common formatting without silently removing letters or extra signs.
  const parentheses = phone.match(/[()]/g)
  if (
    parentheses &&
    (parentheses.join('') !== '()' || !/\(\d+\)/.test(phone))
  ) {
    return undefined
  }

  const digits = phone.replace(/[ ()\-\u00a0+]/g, '')
  if (/^380[1-9]\d{8}$/.test(digits)) return `+${digits}`
  if (!phone.startsWith('+') && /^0[1-9]\d{8}$/.test(digits)) {
    return `+38${digits}`
  }

  return undefined
}

export function isValidOrderPhone(value: unknown): boolean {
  return normalizeOrderPhone(value) !== undefined
}

export function formatOrderPhoneInput(value: string): string {
  const phone = value.trim()
  if (!phone) return value
  if (phone.length > 50 || !/^\+?[\d ()\-\u00a0]+$/.test(phone)) return value

  const digits = phone.replace(/[ ()\-\u00a0+]/g, '')
  const isLocal =
    !phone.startsWith('+') && digits.startsWith('0') && digits.length <= 10
  const isInternational = digits.startsWith('380') && digits.length <= 12
  if (!isLocal && !isInternational) return value

  const parentheses = phone.match(/[()]/g)?.join('') ?? ''
  if (!['', '(', '()'].includes(parentheses)) return value
  const target = isLocal ? `38${digits}` : digits
  // A complete invalid paste must stay visible to validation, rather than
  // becoming a different phone number after formatting or truncation.
  if (target.length === 12 && !isValidOrderPhone(phone)) return value

  return (
    '+38 (0' +
    target.substring(3, 5) +
    (target.length > 5 ? ') ' : '') +
    target.substring(5, 8) +
    (target.length > 8 ? ' ' : '') +
    target.substring(8, 10) +
    (target.length > 10 ? ' ' : '') +
    target.substring(10, 12)
  )
}
