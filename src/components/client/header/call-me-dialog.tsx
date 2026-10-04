'use client'

import { type ChangeEvent, type RefObject, useId } from 'react'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import {
  AnimatedDialogContent,
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import ForwardedMaskedInput from '@/components/ui/forwarded-masked-input'
import { Button } from '@/components/ui/button'
import { callMeBackServer } from '@/server/info/call-me-back.server'

const MASKED_INPUT_PREFIX = '+38 (0'
const MASKED_INPUT_MASK = [
  '+',
  /\d/,
  /\d/,
  ' ',
  '(',
  /\d/,
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
]

interface IFormData {
  name: string
  phoneNumber: string
}

interface ICallMeDialogProps {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
  triggerRef: RefObject<HTMLButtonElement | null>
}

export default function CallMeDialog({
  id,
  open,
  onOpenChange,
  triggerRef,
}: ICallMeDialogProps) {
  const t = useTranslations('main.call-me')
  const nameId = useId()
  const phoneId = useId()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormData>({
    defaultValues: { name: '', phoneNumber: MASKED_INPUT_PREFIX },
  })

  const sendCall = async (data: IFormData): Promise<void> => {
    await callMeBackServer({ name: data.name, phoneNumber: data.phoneNumber })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <AnimatedDialogContent
        id={id}
        finalFocus={triggerRef}
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>{t('call-back')}</DialogTitle>
          <DialogDescription>
            {t('leave-your-details-and-we-will-call-you-back')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(sendCall)} className="grid gap-4 py-4">
          <div className="flex flex-col items-start gap-1">
            <Label htmlFor={nameId}>{t('your-name')}</Label>
            <Input
              id={nameId}
              autoComplete="name"
              placeholder={t('enter-your-name')}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
              {...register('name', { required: t('enter-name') })}
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
            <Label htmlFor={phoneId}>{t('phone-number')}</Label>
            <Controller
              control={control}
              name="phoneNumber"
              rules={{
                required: t('enter-phone-number'),
                validate: (value: string) =>
                  value && value.length === 18
                    ? true
                    : t('enter-full-phone-number'),
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => {
                const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                  const newValue = event.target.value
                  onChange(
                    newValue.startsWith(MASKED_INPUT_PREFIX)
                      ? newValue
                      : MASKED_INPUT_PREFIX,
                  )
                }

                return (
                  <ForwardedMaskedInput
                    id={phoneId}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    mask={MASKED_INPUT_MASK}
                    placeholder={MASKED_INPUT_PREFIX}
                    guide={false}
                    onBlur={onBlur}
                    onChange={handleChange}
                    value={value}
                    ref={ref}
                    aria-invalid={Boolean(errors.phoneNumber)}
                    aria-describedby={
                      errors.phoneNumber ? `${phoneId}-error` : undefined
                    }
                    className="placeholder:text-muted-foreground text-foreground border-input h-[48px] w-full rounded-[8px] border-[1px] bg-transparent px-[8px] py-[14px] text-[16px]"
                  />
                )
              }}
            />
            {errors.phoneNumber ? (
              <p
                id={`${phoneId}-error`}
                role="alert"
                className="text-sm text-red-500"
              >
                {errors.phoneNumber.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" variant="button" disabled={isSubmitting}>
            {t('call-back')}
          </Button>
        </form>
      </AnimatedDialogContent>
    </Dialog>
  )
}
