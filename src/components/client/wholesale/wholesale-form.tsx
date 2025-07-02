'use client'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import ForwardedMaskedInput from '@/components/ui/forwarded-masked-input'
import { useTranslations } from 'next-intl'
import { sendWholesale } from '@/server/info/wholesale.server'
import { toast } from '@/hooks/useToast'
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
    formState: { errors },
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

  const onSubmit = async (data: FormData) => {
    const result = await sendWholesale(data)

    if (result.success) {
      toast({
        title: t('thank_you_we_will_contact_you'),
      })
      reset()
    } else {
      toast({
        title: t('error'),
      })
    }
  }

  return (
    <div className="grid pt-10 md:pt-[140px] lg:grid-cols-2">
      <div className="relative">
        <div className="absolute z-[-1] mt-6 h-32 w-32 rounded-full bg-linear-to-r from-red-200 to-red-300 opacity-50 blur-3xl md:mt-24 md:h-64 md:w-64" />
        <Image
          src={'/images/cart.webp'}
          alt={t('icon_cart')}
          width={400}
          height={400}
          className="mt-5 rotate-[15deg] object-contain md:mt-[20px]"
        />
        <Image
          src={'/images/Вag-Logo.webp'}
          alt={t('icon_cart')}
          width={100}
          height={100}
          className="-mt-10 ml-4 rotate-[-25deg] object-contain md:-mt-[180px] md:ml-[320px]"
        />
        <Image
          src={'/images/Вag-Logo.webp'}
          alt={t('icon_cart')}
          width={150}
          height={150}
          className="mt-5 ml-8 rotate-[25deg] object-contain md:mt-[20px] md:ml-[380px]"
        />
        <Image
          src={'/images/Вag-Logo.webp'}
          alt={t('icon_cart')}
          width={100}
          height={100}
          className="mt-5 ml-4 rotate-[-25deg] object-contain md:mt-[20px] md:ml-[320px]"
        />
        <Image
          src={'/images/Вag-Logo.webp'}
          alt={t('icon_cart')}
          width={150}
          height={150}
          className="mt-5 ml-8 rotate-[25deg] object-contain md:mt-[20px] md:ml-[380px]"
        />
        <Image
          src={'/images/Вag-Logo.webp'}
          alt={t('icon_cart')}
          width={100}
          height={100}
          className="mt-5 ml-4 rotate-[-25deg] object-contain md:mt-[20px] md:ml-[320px]"
        />
        <Image
          src={'/images/Вag-Logo.webp'}
          alt={t('icon_cart')}
          width={150}
          height={150}
          className="mt-5 ml-8 rotate-[25deg] object-contain md:mt-[20px] md:ml-[380px]"
        />
      </div>
      <div className="overflow-hidden">
        <div className="font-rubik text-center text-[32px] lg:text-[54px]">
          {t('fill_out_form')}:
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
          {t('start_cooperation')}
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border-foreground flex flex-col gap-[32px] border border-t-0 border-dashed p-[32px]"
        >
          <div>
            <Input
              className="h-[60px] rounded-none"
              placeholder={t('name')}
              {...register('name', {
                required: t('this_field_is_required'),
                minLength: { value: 2, message: t('minimum_characters') },
                maxLength: { value: 50, message: t('maximum_characters') },
              })}
            />
            {errors.name && (
              <p className="text-red-500">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col items-start">
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
                    className="placeholder:text-muted-foreground text-foreground border-input h-[58px] w-full rounded-none border-[1px] bg-transparent px-[8px] py-[14px] text-[16px]"
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
          <div>
            <Input
              className="h-[60px] rounded-none"
              placeholder="Email"
              {...register('email', {
                required: t('this_field_is_required'),
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: t('invalid_email_format'),
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div>
            <Input
              className="h-[60px] rounded-none"
              placeholder={t('where_you_going_sell')}
              {...register('whereSell', {
                required: t('this_field_is_required'),
                minLength: { value: 2, message: t('minimum_characters') },
                maxLength: { value: 100, message: t('maximum_100_characters') },
              })}
            />
            {errors.whereSell && (
              <p className="text-red-500">{errors.whereSell.message}</p>
            )}
          </div>
          <Input
            className="h-[60px] rounded-none"
            placeholder={t('link_company_name')}
            {...register('link', {
              required: t('this_field_is_required'),
              minLength: { value: 2, message: t('minimum_characters') },
              maxLength: { value: 100, message: t('maximum_100_characters') },
            })}
          />
          <Input
            className="h-[60px] rounded-none"
            placeholder={t('how_did_you_find_about_us')}
            {...register('howYouFindUs')}
          />
          <div className="flex justify-center">
            <Button
              variant="button"
              type="submit"
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
