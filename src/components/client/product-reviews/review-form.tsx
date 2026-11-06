'use client'

import Image from 'next/image'
import { Star, X } from 'lucide-react'
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import { NativeButton as Button } from '@/components/ui/native-button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  REVIEW_MAX_NAME_LENGTH,
  REVIEW_MAX_PHOTOS,
  REVIEW_MAX_PHOTO_BYTES,
  REVIEW_MAX_TEXT_LENGTH,
  REVIEW_PHOTO_ACCEPT,
  reviewPhotoMimeType,
} from '@/constants/product-review'
import { reviewCopy, type ReviewLocale } from './copy'
import { createReviewPhotoPreview } from './photo-preview'
import { ReviewUploadError, uploadReviewPhotoFiles } from './upload-photos'

type SelectedPhoto = { file: File; url: string }

export function ReviewForm({
  productId,
  parentId,
  locale,
}: {
  productId: string
  parentId?: string
  locale: ReviewLocale
}) {
  const copy = reviewCopy[locale]
  const id = useId()
  const [rating, setRating] = useState(0)
  const [photos, setPhotos] = useState<SelectedPhoto[]>([])
  const [sending, setSending] = useState(false)
  const [preparing, setPreparing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const previewUrls = useRef(new Set<string>())
  const photoInput = useRef<HTMLInputElement>(null)
  const busy = useRef(false)
  const activeRequest = useRef<AbortController | null>(null)

  useEffect(() => {
    const urls = previewUrls.current
    return () => {
      activeRequest.current?.abort()
      urls.forEach((url) => URL.revokeObjectURL(url))
      urls.clear()
    }
  }, [])

  const removePhoto = (url: string) => {
    URL.revokeObjectURL(url)
    previewUrls.current.delete(url)
    setPhotos((selected) => selected.filter((photo) => photo.url !== url))
  }

  const addPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? [])
    event.currentTarget.value = ''
    if (busy.current || !files.length) return
    setError('')
    setSuccess(false)
    if (
      files.length + photos.length > REVIEW_MAX_PHOTOS ||
      files.some(
        (file) =>
          !reviewPhotoMimeType(file) ||
          file.size === 0 ||
          file.size > REVIEW_MAX_PHOTO_BYTES,
      )
    ) {
      setError(copy.photoError)
      return
    }
    const selected: SelectedPhoto[] = []
    const controller = new AbortController()
    activeRequest.current = controller
    busy.current = true
    setPreparing(true)
    try {
      // Decode sequentially so large phone photos do not compete for memory.
      for (const file of files) {
        const preview = await createReviewPhotoPreview(file, controller.signal)
        if (controller.signal.aborted) return
        const url = URL.createObjectURL(preview)
        previewUrls.current.add(url)
        selected.push({ file, url })
      }
      setPhotos((existing) => [...existing, ...selected])
    } catch {
      selected.forEach(({ url }) => {
        URL.revokeObjectURL(url)
        previewUrls.current.delete(url)
      })
      if (!controller.signal.aborted) setError(copy.previewError)
    } finally {
      busy.current = false
      activeRequest.current = null
      if (!controller.signal.aborted) setPreparing(false)
    }
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (busy.current) return
    const form = event.currentTarget
    const data = new FormData(form)
    setError('')
    setSuccess(false)
    if (!String(data.get('text') ?? '').trim() || (!parentId && rating === 0)) {
      setError(parentId ? copy.replyRequired : copy.required)
      return
    }
    data.set('productId', productId)
    data.set('locale', locale)
    if (parentId) data.set('parentId', parentId)
    else {
      data.set('rating', String(rating))
    }
    const controller = new AbortController()
    activeRequest.current = controller
    busy.current = true
    setSending(true)
    try {
      if (!parentId && photos.length) {
        setUploadProgress(0)
        const upload = await uploadReviewPhotoFiles({
          productId,
          files: photos.map(({ file }) => file),
          website: String(data.get('website') ?? ''),
          signal: controller.signal,
          onProgress: setUploadProgress,
        })
        data.set('uploadId', upload.uploadId)
        data.set('uploadToken', upload.uploadToken)
      }
      const response = await fetch('/api/product-reviews', {
        method: 'POST',
        body: data,
        signal: controller.signal,
      })
      const result = await response.json()
      if (!response.ok || result.success !== true) {
        setError(
          locale === 'uk' && typeof result.message === 'string'
            ? result.message
            : copy.error,
        )
        return
      }
      form.reset()
      setRating(0)
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url))
      previewUrls.current.clear()
      setPhotos([])
      setSuccess(true)
    } catch (cause) {
      if (!controller.signal.aborted) {
        setError(
          locale === 'uk' && cause instanceof ReviewUploadError && cause.message
            ? cause.message
            : copy.error,
        )
      }
    } finally {
      busy.current = false
      activeRequest.current = null
      if (!controller.signal.aborted) {
        setSending(false)
        setUploadProgress(null)
      }
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-5 max-w-2xl"
      aria-label={parentId ? copy.replyingTo : copy.write}
    >
      <fieldset
        disabled={sending || preparing}
        className="grid gap-5 disabled:opacity-70"
      >
        <div className="grid gap-2">
          <label htmlFor={`${id}-author`} className="text-sm font-medium">
            {copy.name}
          </label>
          <Input
            id={`${id}-author`}
            name="author"
            autoComplete="name"
            maxLength={REVIEW_MAX_NAME_LENGTH}
            placeholder={copy.namePlaceholder}
          />
        </div>
        {!parentId && (
          <fieldset>
            <legend className="mb-2 text-sm font-medium">
              {copy.rating} <span aria-hidden="true">*</span>
            </legend>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <label
                  key={star}
                  className="relative cursor-pointer rounded-md p-1.5 text-amber-600 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-current"
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="rating"
                    value={star}
                    checked={rating === star}
                    required
                    onChange={() => setRating(star)}
                    aria-label={`${star} ${copy.outOf}`}
                  />
                  <Star
                    aria-hidden="true"
                    className={`h-8 w-8 ${star <= rating ? 'fill-current' : ''}`}
                  />
                </label>
              ))}
            </div>
          </fieldset>
        )}
        <div className="grid gap-2">
          <label htmlFor={`${id}-text`} className="text-sm font-medium">
            {parentId ? copy.replyText : copy.text}{' '}
            <span aria-hidden="true">*</span>
          </label>
          <Textarea
            id={`${id}-text`}
            name="text"
            rows={4}
            required
            maxLength={REVIEW_MAX_TEXT_LENGTH}
            className="min-h-28"
          />
        </div>
        {!parentId && (
          <div className="grid gap-2">
            <label htmlFor={`${id}-photos`} className="text-sm font-medium">
              {copy.photos}
            </label>
            <input
              ref={photoInput}
              id={`${id}-photos`}
              type="file"
              hidden
              accept={REVIEW_PHOTO_ACCEPT}
              multiple
              onChange={addPhotos}
              aria-describedby={`${id}-photo-help`}
            />
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => photoInput.current?.click()}
                disabled={photos.length >= REVIEW_MAX_PHOTOS}
                aria-describedby={`${id}-photo-help ${id}-photo-count`}
              >
                {copy.addPhotos}
              </Button>
              <span
                id={`${id}-photo-count`}
                role="status"
                className="text-muted-foreground text-sm"
              >
                {photos.length
                  ? `${copy.selectedPhotos}: ${photos.length} / ${REVIEW_MAX_PHOTOS}`
                  : copy.noPhotos}
              </span>
            </div>
            <p
              id={`${id}-photo-help`}
              className="text-muted-foreground text-xs"
            >
              {copy.photoHelp}
            </p>
            {photos.length > 0 && (
              <ul className="flex flex-wrap gap-3 pt-2">
                {photos.map(({ file, url }, index) => (
                  <li key={url} className="relative">
                    <Image
                      src={url}
                      alt={file.name}
                      width={96}
                      height={96}
                      unoptimized
                      className="h-24 w-24 rounded-lg border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(url)}
                      aria-label={`${copy.removePhoto} ${index + 1}`}
                      className="bg-background absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border shadow-sm"
                    >
                      <X aria-hidden="true" className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <div hidden aria-hidden="true">
          <label htmlFor={`${id}-website`}>Website</label>
          <input
            id={`${id}-website`}
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <p className="text-muted-foreground text-xs">{copy.moderation}</p>
        <Button
          type="submit"
          variant="danger"
          className="w-fit max-w-full"
          disabled={sending || preparing}
        >
          {sending ? copy.sending : parentId ? copy.submitReply : copy.submit}
        </Button>
      </fieldset>
      {preparing && (
        <p role="status" className="text-muted-foreground mt-3 text-sm">
          {copy.preparingPhotos}
        </p>
      )}
      {uploadProgress !== null && (
        <p role="status" className="text-muted-foreground mt-3 text-sm">
          {uploadProgress < 100
            ? `${copy.uploadingPhotos}: ${uploadProgress}%`
            : copy.processingPhotos}
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p
          role="status"
          className="mt-3 text-sm text-green-800 dark:text-green-400"
        >
          {parentId ? copy.replyPending : copy.pending}
        </p>
      )}
    </form>
  )
}
