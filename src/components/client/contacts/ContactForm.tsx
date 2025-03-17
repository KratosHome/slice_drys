'use client'
import Button from '../ui/button'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { callMeBack } from '@/server/info/call-me-back'
import ForwardedMaskedInput from '@/components/client/ui/ForwardedMaskedInput'
import { toast } from '@/hooks/use-toast'
import { useTranslations } from 'next-intl'

interface ContactFormData {
  name: string
  phoneNumber: string
}

const ContactForm = ({
  button,
  phone_field_description,
  placeholder,
  form_description,
}: {
  button: string
  phone_field_description: string
  placeholder: string
  form_description: string
}) => {
  const t = useTranslations('contacts')

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      phoneNumber: '+38 (0',
    },
  })

  const sendCall = async (data: ContactFormData) => {
    await callMeBack({
      name: '',
      phoneNumber: data.phoneNumber,
    })

    toast({
      title: t('thank_you_we_will_contact_you_shortly'),
    })

    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(sendCall)}
      className="mx-auto mb-[205px] mt-[110px] flex max-w-[570px] flex-col items-center justify-center md:mb-[229px] md:mt-9"
    >
      <div className="form-description text-center font-rubik text-[32px] font-normal md:text-2xl">
        {form_description}
      </div>
      <div>
        <span className="block rotate-90 animate-follow font-rubik text-[108px] font-normal leading-none">
          {'>'}
        </span>
      </div>
      <div className="mt-[70px] flex w-full max-w-[550px] flex-col items-start">
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            required: `${phone_field_description}`,
            validate: (value: string) =>
              value && value.length === 18
                ? true
                : t('enter_full_phone_number'),
          }}
          render={({ field: { onChange, onBlur, value, ref } }) => {
            const prefix = '+38 (0'
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                placeholder={placeholder}
                guide={false}
                onBlur={onBlur}
                onChange={handleChange}
                value={value}
                ref={ref}
                className="!h-[60px] w-full max-w-[550px] rounded-md border p-4 text-base font-medium leading-normal shadow-sm md:px-4 md:py-[18px] md:text-xl"
              />
            )
          }}
        />
        <div className="description text-poppins mb-[60px] pl-[10px] text-base font-normal">
          {phone_field_description}
        </div>
        {errors.phoneNumber && (
          <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
        )}
      </div>
      <Button
        type="submit"
        variant="button"
        className="flex h-[60px] items-center px-[60px] font-poppins text-2xl font-medium md:mt-[90px]"
      >
        {button}
      </Button>
    </form>
  )
}

export default ContactForm
