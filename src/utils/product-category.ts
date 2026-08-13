export type ProductCategoryReference =
  | string
  | {
      slug?: string | null
      parentCategory?: unknown
    }

const CANONICAL_CATEGORY_PRIORITY = [
  'mixes',
  'meat',
  'fruits',
  'vegetables',
  'promotions',
] as const

const PROMOTIONAL_CATEGORY_SLUGS = new Set(['promotions'])

function normalizeCategorySlug(
  category: ProductCategoryReference | null | undefined,
): string | null {
  const slug = typeof category === 'string' ? category : category?.slug
  const normalizedSlug = slug?.trim().toLowerCase()

  return normalizedSlug || null
}

function selectByPriority(slugs: readonly string[]): string | null {
  const slugSet = new Set(slugs)

  return CANONICAL_CATEGORY_PRIORITY.find((slug) => slugSet.has(slug)) ?? null
}

/**
 * Selects the one stable category used in canonical product URLs.
 *
 * Products can belong to both a root category and one or more child/special
 * categories. Root, non-promotional categories win whenever parent data is
 * available. Older callers that only provide slugs still get a deterministic
 * result via the known root priority and an alphabetical fallback.
 */
export function getCanonicalProductCategorySlug(
  categories: readonly (ProductCategoryReference | null | undefined)[] = [],
): string | null {
  const normalizedCategories = categories
    .map((category) => ({
      slug: normalizeCategorySlug(category),
      isKnownRoot:
        typeof category !== 'string' &&
        category != null &&
        'parentCategory' in category &&
        category.parentCategory == null,
    }))
    .filter(
      (category): category is { slug: string; isKnownRoot: boolean } =>
        category.slug !== null,
    )

  const uniqueSlugs = Array.from(
    new Set(normalizedCategories.map(({ slug }) => slug)),
  ).sort()

  if (uniqueSlugs.length === 0) return null

  const knownRootSlugs = normalizedCategories
    .filter(({ isKnownRoot }) => isKnownRoot)
    .map(({ slug }) => slug)

  const nonPromotionalRootSlugs = knownRootSlugs.filter(
    (slug) => !PROMOTIONAL_CATEGORY_SLUGS.has(slug),
  )

  const preferredRoot =
    selectByPriority(nonPromotionalRootSlugs) ??
    [...nonPromotionalRootSlugs].sort()[0]

  if (preferredRoot) return preferredRoot

  const remainingRoot =
    selectByPriority(knownRootSlugs) ?? [...knownRootSlugs].sort()[0]

  if (remainingRoot) return remainingRoot

  const priorityFallback = selectByPriority(uniqueSlugs)
  if (priorityFallback) return priorityFallback

  return (
    uniqueSlugs.find((slug) => !PROMOTIONAL_CATEGORY_SLUGS.has(slug)) ??
    uniqueSlugs[0]
  )
}
