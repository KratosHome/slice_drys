export const pickRandom = <T>(arr: readonly T[], n: number): T[] => {
  const len = arr.length
  if (n <= 0 || len === 0) return []
  if (n >= len) return [...arr]

  const result = new Array<T>(n)
  const used = new Set<number>()

  for (let i = 0; i < n; i++) {
    let idx = Math.floor(Math.random() * len)
    while (used.has(idx)) idx = Math.floor(Math.random() * len)
    used.add(idx)
    result[i] = arr[idx] as T
  }

  return result
}