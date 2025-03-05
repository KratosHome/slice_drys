export const getPaginationRange = (currentPage: number, totalPages: number) => {
  const delta = 2
  const range: number[] = []

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i)
    }
  }

  const rangeWithDots: (number | 'ellipsis')[] = []
  let prev = 0
  for (const page of range) {
    if (page - prev > 1) {
      rangeWithDots.push('ellipsis')
    }
    rangeWithDots.push(page)
    prev = page
  }
  return rangeWithDots
}
