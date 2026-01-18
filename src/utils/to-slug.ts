export const toSlug = (input: string): string => {
  const output: string = input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')

  return output
}
