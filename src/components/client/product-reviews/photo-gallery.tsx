'use client'

import Image from 'next/image'
import { useId, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { ReviewPhoto } from '@/types/product-review'
import { reviewCopy, type ReviewLocale } from './copy'

export function ReviewPhotoGallery({
  photos,
  author,
  locale,
}: {
  photos: ReviewPhoto[]
  author: string
  locale: ReviewLocale
}) {
  const copy = reviewCopy[locale]
  const dialog = useRef<HTMLDialogElement>(null)
  const id = useId()
  const [selected, setSelected] = useState<ReviewPhoto | null>(null)

  if (photos.length === 0) return null

  return (
    <>
      <ul className="mt-4 flex flex-wrap gap-3">
        {photos.map((photo, index) => (
          <li key={photo.url}>
            <button
              type="button"
              aria-label={`${copy.enlarge} ${index + 1}: ${author}`}
              className="block overflow-hidden rounded-lg border focus-visible:outline-2 focus-visible:outline-offset-4"
              onClick={() => {
                setSelected(photo)
                dialog.current?.showModal()
              }}
            >
              <Image
                src={photo.url}
                alt={`${copy.photo} ${index + 1}: ${author}`}
                width={112}
                height={112}
                unoptimized
                className="h-24 w-24 object-cover sm:h-28 sm:w-28"
              />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        aria-labelledby={`${id}-title`}
        className="bg-background text-foreground fixed inset-0 m-auto max-h-[90dvh] w-[min(95vw,960px)] max-w-none rounded-xl border p-4 backdrop:bg-black/80"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close()
        }}
      >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 id={`${id}-title`} className="text-sm font-medium">
            {copy.photo}: {author}
          </h3>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label={copy.closePhoto}
            className="rounded-md p-2 focus-visible:outline-2"
          >
            <X aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        {selected && (
          <Image
            src={selected.url}
            alt={`${copy.photo}: ${author}`}
            width={1200}
            height={1200}
            unoptimized
            className="max-h-[72dvh] w-full object-contain"
          />
        )}
      </dialog>
    </>
  )
}
