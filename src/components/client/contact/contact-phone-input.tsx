'use client'
import { useTranslations } from 'next-intl'
import React from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
  example: string
  exampleRequired: string
}

export default function ContactPhoneInput() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: 'onBlur',
  })

  const onSubmit = (data: FormValues) => {
    alert(`Phone number submitted: ${data.phone}`)
  }

  const t = useTranslations('Contacts')
  const phoneRegex = /^\+\d{2}\s?\d{3}\s?\d{2}\s?\d{2}\s?\d{3}$/

  return (
    <div className="flex flex-col items-center justify-center pt-[62]">
      <form onSubmit={handleSubmit(onSubmit)} className="w-80 rounded bg-white">
        <label htmlFor="phone" className="mb-2 block text-gray-700">
          Телефон
        </label>
        <input
          id="phone"
          {...register('phone', {
            required: "Телефон обов'язковий",
            pattern: {
              value: phoneRegex,
              message: 'Невірний формат телефону',
            },
          })}
          placeholder="+38 (093) 12 34 567"
          className={`w-full border ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          } mb-2 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.phone && (
          <p className="mb-2 text-sm text-red-500">{errors.phone.message}</p>
        )}
        <p className="mb-4 text-sm text-gray-500">
          У форматі +38 (093) 12 34 567
        </p>
        <button
          type="submit"
          className="w-full rounded bg-black py-2 text-white hover:bg-gray-800"
        >
          {t('sendButton')}
        </button>
      </form>
    </div>
  )
}
