export type RubikFontProfile = 'home' | 'headings' | 'controls' | 'full'

export function getRubikFontProfile(
  pathname: string,
  locale: string,
): RubikFontProfile {
  const path = pathname.replace(/\/$/, '')
  if (path === `/${locale}`) return 'home'
  if (path === `/${locale}/blog`) return 'headings'
  if (path.startsWith(`/${locale}/blog/`)) return 'controls'
  if (path.startsWith(`/${locale}/products/`)) {
    return path.includes('/product/') ? 'controls' : 'headings'
  }
  // Other pages have different first-screen headings. Keep complete coverage
  // until they have their own measured critical character set.
  return 'full'
}

export function hasUncoveredCharacters(text: string, covered: Set<string>) {
  return Array.from(text).some(
    (character) => !/\s/.test(character) && !covered.has(character),
  )
}
