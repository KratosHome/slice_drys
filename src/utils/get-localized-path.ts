export const getLocalizedPath = (newLocale: string, path: string): string => {
  const pathWithoutLocale: string = path.replace(/^\/(uk|en)(?=\/|$)/i, '')

  return `/${newLocale}${pathWithoutLocale}`
}
