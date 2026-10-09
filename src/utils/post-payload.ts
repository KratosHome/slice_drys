// Leave room for React's multipart encoding below the 4 MB Server Action limit.
export const MAX_POST_PAYLOAD_BYTES = 3.5 * 1024 * 1024

export const isPostPayloadTooLarge = (args: unknown[]): boolean =>
  new TextEncoder().encode(JSON.stringify(args)).byteLength >
  MAX_POST_PAYLOAD_BYTES
