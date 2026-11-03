'use client'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ForwardedMaskedInput from '@/components/ui/forwarded-masked-input'
import { useTranslations } from 'next-intl'
import { sendWholesale } from '@/server/info/wholesale.server'
import { toast } from '@/hooks/useToast'
import { useLeadSubmit } from '@/hooks/useLeadSubmit'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface FormData {
  name: string
  phoneNumber: string
  email: string
  whereSell: string
  link: string
  howYouFindUs: string
}

const WholesaleForm = () => {
  const t = useTranslations('wholesale')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      phoneNumber: '+38 (0',
      email: '',
      whereSell: '',
      link: '',
      howYouFindUs: '',
    },
  })

  const onSubmit = useLeadSubmit<FormData>(
    'wholesale',
    sendWholesale,
    () => {
      toast({
        title: t('thank-you-we-will-contact-you'),
      })
      reset()
    },
    t('error'),
  )

  return (
    <div className="grid pt-10 md:pt-[140px] lg:grid-cols-2">
      <div className="relative">
        <div className="absolute z-[-1] mt-6 h-32 w-32 rounded-full bg-linear-to-r from-red-200 to-red-300 opacity-50 blur-3xl md:mt-24 md:h-64 md:w-64" />
        <Image
          src={'/images/cart.webp'}
          alt={t('icon-cart')}
          width={400}
          height={400}
          className="mx-auto mt-5 w-4/5 max-w-[400px] rotate-[15deg] object-contain md:mx-0 md:mt-[20px] md:w-[400px]"
        />
        <Image
          src={'/images/Вag-Logo.webp'}
          alt={t('icon-cart')}
          width={100}
          height={100}
          className="-mt-10 ml-4 rotate-[-25deg] object-contain md:-mt-[180px] md:ml-[320px]"
        />
        <Image
          src={'/images/Вag-Logo.webp'}
          alt={t('icon-cart')}
          width={150}
          height={150}
          className="mt-5 ml-8 rotate-[25deg] object-contain md:mt-[20px] md:ml-[380px]"
        />
        <Image
          src={'/images/Вag-Logo.webp'}
          alt={t('icon-cart')}
          width={100}
          height={100}
          className="mt-5 ml-4 rotate-[-25deg] object-contain md:mt-[20px] md:ml-[320px]"
        />
        <Image
          src={'/images/Вag-Logo.webp'}
          alt={t('icon-cart')}
          width={150}
          height={150}
          className="mt-5 ml-8 rotate-[25deg] object-contain md:mt-[20px] md:ml-[380px]"
        />
        <Image
          src={'/images/Вag-Logo.webp'}
          alt={t('icon-cart')}
          width={100}
          height={100}
          className="mt-5 ml-4 rotate-[-25deg] object-contain md:mt-[20px] md:ml-[320px]"
        />
        <Image
          src={'/images/Вag-Logo.webp'}
          alt={t('icon-cart')}
          width={150}
          height={150}
          className="mt-5 ml-8 rotate-[25deg] object-contain md:mt-[20px] md:ml-[380px]"
        />
      </div>
      <div className="overflow-hidden">
        <div className="font-rubik text-center text-[32px] lg:text-[54px]">
          {t('fill-out-form')}:
        </div>
        <div className="relative flex justify-center gap-[46px]">
          <span className="animate-follow font-rubik block text-[108px] leading-none">
            {'>'}
          </span>
          <span className="animate-follow font-rubik block text-[108px] leading-none">
            {'>'}
          </span>
          <span className="animate-follow font-rubik block text-[108px] leading-none">
            {'>'}
          </span>
        </div>
        <div className="font-rubik bg-foreground text-background mt-14 py-5 text-center text-[32px] lg:text-[40px]">
          {t('start-cooperation')}
        </div>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="border-foreground flex flex-col gap-[32px] border border-t-0 border-dashed p-[32px]"
        >
          <div className="grid gap-2">
            <Label htmlFor="wholesale-name">{t('name')}</Label>
            <Input
              id="wholesale-name"
              autoComplete="name"
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={
                errors.name ? 'wholesale-name-error' : undefined
              }
              className="h-[60px] rounded-none"
              {...register('name', {
                required: t('this-field-is-required'),
                minLength: { value: 2, message: t('minimum-characters') },
                maxLength: { value: 50, message: t('maximum-characters') },
              })}
            />
            {errors.name && (
              <p
                id="wholesale-name-error"
                role="alert"
                className="text-red-500"
              >
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wholesale-phone">{t('phone-number')}</Label>
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
                    id="wholesale-phone"
                    name="phoneNumber"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    aria-invalid={Boolean(errors.phoneNumber)}
                    aria-describedby={
                      errors.phoneNumber ? 'wholesale-phone-error' : undefined
                    }
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
                    className="placeholder:text-muted-foreground text-foreground border-input h-[58px] w-full rounded-none border-[1px] bg-transparent px-[8px] py-[14px] text-[16px]"
                  />
                )
              }}
            />
            {errors.phoneNumber && (
              <p
                id="wholesale-phone-error"
                role="alert"
                className="text-sm text-red-500"
              >
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wholesale-email">{t('email')}</Label>
            <Input
              id="wholesale-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? 'wholesale-email-error' : undefined
              }
              className="h-[60px] rounded-none"
              {...register('email', {
                required: t('this-field-is-required'),
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: t('invalid-email-format'),
                },
              })}
            />
            {errors.email && (
              <p
                id="wholesale-email-error"
                role="alert"
                className="text-red-500"
              >
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wholesale-where-sell">
              {t('where-you-going-sell')}
            </Label>
            <Input
              id="wholesale-where-sell"
              required
              aria-invalid={Boolean(errors.whereSell)}
              aria-describedby={
                errors.whereSell ? 'wholesale-where-sell-error' : undefined
              }
              className="h-[60px] rounded-none"
              {...register('whereSell', {
                required: t('this-field-is-required'),
                minLength: { value: 2, message: t('minimum-characters') },
                maxLength: { value: 100, message: t('maximum-100-characters') },
              })}
            />
            {errors.whereSell && (
              <p
                id="wholesale-where-sell-error"
                role="alert"
                className="text-red-500"
              >
                {errors.whereSell.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wholesale-company">{t('link-company-name')}</Label>
            <Input
              id="wholesale-company"
              required
              aria-invalid={Boolean(errors.link)}
              aria-describedby={
                errors.link ? 'wholesale-company-error' : undefined
              }
              className="h-[60px] rounded-none"
              {...register('link', {
                required: t('this-field-is-required'),
                minLength: { value: 2, message: t('minimum-characters') },
                maxLength: { value: 100, message: t('maximum-100-characters') },
              })}
            />
            {errors.link && (
              <p
                id="wholesale-company-error"
                role="alert"
                className="text-red-500"
              >
                {errors.link.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="wholesale-referral">
              {t('how-did-you-find-about-us')}
            </Label>
            <Input
              id="wholesale-referral"
              className="h-[60px] rounded-none"
              {...register('howYouFindUs')}
            />
          </div>
          <div className="flex justify-center">
            <Button
              variant="button"
              type="submit"
              disabled={isSubmitting}
              className="h-[60px]! max-w-max! px-7"
            >
              {t('send')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WholesaleForm
