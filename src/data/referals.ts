export interface ReferralDefinition {
  code: string
  name: string
  rateBps: number
  link: string
}

export const referrals = [
  {
    name: 'Oleg',
    code: 'x3fjUcj52Jf',
    rateBps: 1_500,
    link: 'https://www.instagram.com/oleg.kus.kz/',
  },
  {
    name: 'кнопка',
    code: 'button',
    rateBps: 1_000,
    link: 'https://www.instagram.com/oleg.kus.kz/',
  },
  {
    name: 'Олександре',
    code: 'keddr',
    rateBps: 1_000,
    link: 'https://www.youtube.com/@keddr/featured',
  },
] as const satisfies readonly ReferralDefinition[]

export function getReferralByCode(
  code: string | undefined,
): ReferralDefinition | undefined {
  if (!code) return undefined

  return referrals.find((referral) => referral.code === code)
}
