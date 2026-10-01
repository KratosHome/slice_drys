export function normalizeProductSlug(slug: string): string {
  return slug.trim().toLowerCase()
}

/** Match a whole legacy slug without treating URL characters as regex syntax. */
export function productSlugPattern(slug: string): RegExp {
  const escapedSlug = normalizeProductSlug(slug).replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&',
  )
  return new RegExp(`^${escapedSlug}$`, 'i')
}

/** Prefer the indexed canonical slug; only scan for legacy casing if missing. */
export async function findByProductSlug<T>(
  slug: string,
  find: (value: string | RegExp) => PromiseLike<T | null>,
): Promise<T | null> {
  const normalizedSlug = normalizeProductSlug(slug)
  if (!normalizedSlug) return null

  const product = await find(normalizedSlug)
  return product ?? (await find(productSlugPattern(normalizedSlug)))
}
