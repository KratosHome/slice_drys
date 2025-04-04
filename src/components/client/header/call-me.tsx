import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Controller, useForm } from 'react-hook-form'
import { callMeBack } from '@/server/info/call-me-back'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import ForwardedMaskedInput from '@/components/ui/ForwardedMaskedInput'
import { Button } from '@/components/ui/button'

interface FormData {
  name: string
  phoneNumber: string
}

const CallMe = () => {
  const t = useTranslations('main.call-me')

  const [isCallOpen, setIsCallOpen] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phoneNumber: '+38 (0',
    },
  })

  const sendCall = async (data: FormData) => {
    await callMeBack({
      name: data.name,
      phoneNumber: data.phoneNumber,
    })
    reset()
    setIsCallOpen(false)
  }

  return (
    <Dialog open={isCallOpen} onOpenChange={setIsCallOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="button">
          {t('call-back')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('call-back')}</DialogTitle>
          <DialogDescription>
            {t('leave-your-details-and-we-will-call-you-back')}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(sendCall)} className="grid gap-4 py-4">
          <div className="flex flex-col items-start">
            <Label htmlFor="name" className="text-right">
              {t('your-name')}
            </Label>
            <Input
              id="name"
              placeholder={t('enter-your-name')}
              {...register('name', { required: `${t('enter-name')}` })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col items-start">
            <Label htmlFor="phoneNumber" className="text-right">
              {t('phone-number')}
            </Label>
            <Controller
              control={control}
              name="phoneNumber"
              rules={{
                required: `${t('enter-phone-number')}`,
                validate: (value: string) =>
                  value && value.length === 18
                    ? true
                    : `${t('enter-full-phone-number')}`,
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => {
                const prefix = '+38 (0'
                const handleChange = (
                  e: React.ChangeEvent<HTMLInputElement>,
                ) => {
                  let newVal = e.target.value
                  if (!newVal.startsWith(prefix)) {
                    newVal = prefix
                  }
                  onChange(newVal)
                }
                return (
                  <ForwardedMaskedInput
                    id="phoneNumber"
                    mask={[
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
                    ]}
                    placeholder={prefix}
                    guide={false}
                    onBlur={onBlur}
                    onChange={handleChange}
                    value={value}
                    ref={ref}
                    className="placeholder:text-muted-foreground text-foreground border-input h-[48px] w-full rounded-[8px] border-[1px] bg-transparent px-[8px] py-[14px] text-[16px]"
                  />
                )
              }}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <Button type="submit" variant="button">
            {t('call-back')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CallMe
