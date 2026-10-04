'use client'

import Image, { getImageProps, type ImageProps } from 'next/image'

interface ViewportImageProps
  extends Omit<ImageProps, 'loading' | 'preload' | 'priority' | 'placeholder'> {
  enabled: boolean
}

// Callers reserve the image slot; only noscript has a fetchable source during SSR.
export default function ViewportImage({
  enabled,
  alt,
  ...imageProps
}: ViewportImageProps) {
  const { props: fallbackProps } = getImageProps({
    ...imageProps,
    alt,
    loading: 'lazy',
    fetchPriority: 'auto',
  })

  return (
    <>
      {enabled && <Image {...imageProps} alt={alt} loading="eager" />}
      <noscript>
        {/* Next's generated responsive sources preserve optimization without JavaScript. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img {...fallbackProps} alt={alt} />
      </noscript>
    </>
  )
}
