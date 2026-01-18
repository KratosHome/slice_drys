export const getPaginationRange = (
  currentPage: number,
  totalPages: number,
): (number | 'ellipsis')[] => {
  const delta = 2
  const range: number[] = []

  for (let index = 1; index <= totalPages; index++) {
    if (
      index === 1 ||
      index === totalPages ||
      (index >= currentPage - delta && index <= currentPage + delta)
    ) {
      range.push(index)
    }
  }

  const rangeWithDots: (number | 'ellipsis')[] = []

  let prev: number = 0

  for (const page of range) {
    if (page - prev > 1) rangeWithDots.push('ellipsis')

    rangeWithDots.push(page)
    prev = page
  }

  return rangeWithDots
}
