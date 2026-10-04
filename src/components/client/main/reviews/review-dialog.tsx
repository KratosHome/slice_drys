'use client'

import { type RefObject, useId, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'

import {
  AnimatedDialogContent,
  ClientDialogHeader,
  Dialog,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/useToast'
import { sendReviews } from '@/server/info/send-reviews.server'
import { cn } from '@/utils/cn'
import reviewDialogStyles from './review-dialog.module.css'

interface IFormData {
  name: string
  text: string
}

interface IReviewDialogProps {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

export default function ReviewDialog({
  id,
  open,
  onOpenChange,
  triggerRef,
}: IReviewDialogProps) {
  const t = useTranslations('main.reviews')
  const nameId = useId()
  const textId = useId()
  const nameInputRef = useRef<HTMLInputElement>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormData>({ defaultValues: { name: '', text: '' } })
  const nameField = register('name', {
    required: t('enter-name'),
    validate: (value) => value.trim().length > 0 || t('enter-name'),
  })

  const sendReview = async (data: IFormData): Promise<void> => {
    const result = await sendReviews({
      name: data.name.trim(),
      text: data.text.trim(),
    })

    if (!result.success) {
      toast({ title: t('send-error'), variant: 'destructive' })
      return
    }

    toast({ title: t('thanks-for-the-feedback') })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatedDialogContent
        id={id}
        initialFocus={nameInputRef}
        finalFocus={triggerRef}
        aria-describedby={undefined}
        showCloseButton={false}
        overlayClassName="bg-black/45 backdrop-blur-[2px]"
        className={cn(
          reviewDialogStyles.content,
          'w-[calc(100%_-_32px)] overflow-hidden rounded-none border-none bg-transparent p-0 sm:max-w-[500px]',
        )}
      >
        <ClientDialogHeader className="bg-foreground text-background p-6">
          <DialogTitle className="font-rubik text-center text-[32px]">
            {t('add-new-review')}
          </DialogTitle>
        </ClientDialogHeader>
        <form
          onSubmit={handleSubmit(sendReview)}
          className="bg-background grid gap-4 p-6"
        >
          <div className="flex flex-col items-start gap-1">
            <Label htmlFor={nameId}>{t('name')}</Label>
            <Input
              id={nameId}
              autoComplete="name"
              maxLength={100}
              placeholder={t('name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
              {...nameField}
              ref={(element) => {
                nameField.ref(element)
                nameInputRef.current = element
              }}
            />
            {errors.name ? (
              <p
                id={`${nameId}-error`}
                role="alert"
                className="text-sm text-red-500"
              >
                {errors.name.message}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-1">
            <Label htmlFor={textId}>{t('feedback')}</Label>
            <Textarea
              id={textId}
              maxLength={2000}
              placeholder={t('feedback')}
              className="h-[200px] resize-none"
              aria-invalid={Boolean(errors.text)}
              aria-describedby={errors.text ? `${textId}-error` : undefined}
              {...register('text', {
                required: t('enter-text'),
                validate: (value) => value.trim().length > 0 || t('enter-text'),
              })}
            />
            {errors.text ? (
              <p
                id={`${textId}-error`}
                role="alert"
                className="text-sm text-red-500"
              >
                {errors.text.message}
              </p>
            ) : null}
          </div>
          <div className="flex justify-between gap-3">
            <Button
              type="button"
              variant="button"
              className="bg-background text-foreground border-foreground hover:bg-background! hover:text-accent-foreground w-full border-1 shadow-xs"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              {t('back')}
            </Button>
            <Button
              type="submit"
              variant="button"
              className="w-full"
              disabled={isSubmitting}
            >
              {t('send')}
            </Button>
          </div>
        </form>
      </AnimatedDialogContent>
    </Dialog>
  )
}
