/** Ensures data passed from Server Components to Client Components is JSON-safe. */
export function toPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}
