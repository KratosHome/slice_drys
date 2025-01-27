'use client'

import React, { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { useCartStore } from '@/store/cartStore'
import NovaPoshtaCities from './nova-poshta'
import { RadioGroup, RadioGroupItem } from '@/components/client/ui/radio-group'

interface DeliveryInfo {
  city: string
  brunch: string
  deliveryMethod?: string
}

interface FormData {
  name: string
  surname: string
  phoneNumber: string
  email: string
  deliveryInfo: DeliveryInfo
  paymentInfo: string
  comment: string
  acceptTerms: boolean
  noCall: boolean
}

interface CartFormRef {
  submit: () => void
}

const CartForm = forwardRef<CartFormRef>((_, ref) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>()

  const setFormData = useCartStore((state) => state.setCartFormData)
  const formData = useCartStore((state) => state.cart.formData)

  useEffect(() => {
    if (formData) {
      setValue('name', formData.name)
      setValue('surname', formData.surname)
      setValue('phoneNumber', formData.phoneNumber)
      setValue('email', formData.email)
      setValue('deliveryInfo.city', formData.deliveryInfo?.city || '')
      setValue('deliveryInfo.brunch', formData.deliveryInfo?.brunch || '')
      setValue(
        'deliveryInfo.deliveryMethod',
        formData.deliveryInfo?.deliveryMethod || '',
      )

      setValue('paymentInfo', formData.paymentInfo)
      setValue('comment', formData.comment)
      setValue('acceptTerms', formData.acceptTerms)
      setValue('noCall', formData.noCall)
    }
  }, [formData, setValue])

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('deliveryInfo.deliveryMethod', event.target.value)
  }

  const onSubmit = (data: FormData) => {
    const partialData = {
      ...data,
      formStep:
        formData && formData.formStep !== null
          ? formData.formStep < 4
            ? formData.formStep + 1
            : formData.formStep
          : 1,
    }
    setFormData(partialData)
  }

  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <input
          className="mt-5 border border-gray-300"
          placeholder="Призвище"
          id="surname"
          {...register('surname', { required: true })}
        />
        {errors.surname && <span>This field is required</span>}
      </div>
      <div>
        <input
          className="mt-5 border border-gray-300"
          placeholder="Імʼя"
          id="name"
          {...register('name', { required: true })}
        />
        {errors.name && <span>This field is required</span>}
      </div>
      <div>
        <input
          className="mt-5 border border-gray-300"
          placeholder="Телефон"
          id="phoneNumber"
          type="text"
          maxLength={17}
          {...register('phoneNumber', {
            minLength: {
              value: 17,
              message: 'не вірна довжина номера',
            },
            maxLength: {
              value: 17,
              message: 'не вірна довжина номера',
            },
            required: 'Це поле є обов’язковим',
          })}
          onClick={(e) => {
            const target = e.target as HTMLInputElement
            target.value = target.value == '' ? '+38 (0' : target.value
          }}
          onInput={(e) => {
            const target = e.target as HTMLInputElement
            target.value =
              '+38 (0' +
              target.value.replace(/\D/g, '').substring(3, 5) +
              (target.value.length > 7 ? ') ' : '') +
              (target.value.length > 9
                ? target.value.replace(/\D/g, '').substring(5)
                : '')
          }}
        />
        {errors.phoneNumber && <span>{errors.phoneNumber?.message}</span>}
      </div>
      <div>У форматі +38(093) 123 45 67</div>
      <div>
        <input
          className="mt-5 border border-gray-300"
          placeholder="E-mail"
          id="email"
          {...register('email', {
            required: 'Це поле є обов’язковим',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Некоректний формат електронної пошти',
            },
          })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>
      {formData && formData.formStep >= 1 && (
        <RadioGroup onChange={handleRadioChange}>
          Оберіть відділення нової пошти
          <div>
            <RadioGroupItem value="novaPoshta" id="r1" />
            Нова пошта
            {formData?.deliveryInfo?.deliveryMethod == 'novaPoshta' ? 1 : 2}
            <NovaPoshtaCities
              city={formData?.deliveryInfo?.city || ''}
              brunch={formData?.deliveryInfo?.brunch || ''}
              onCityChange={(newCity) => {
                setValue('deliveryInfo.city', newCity)
              }}
              onBrunchChange={(newBrunch) => {
                setValue('deliveryInfo.brunch', newBrunch)
              }}
              {...register('deliveryInfo.brunch', { required: true })}
            />
            {errors.deliveryInfo && <span>This field is required</span>}
          </div>
          <div>
            <RadioGroupItem value="Courier" id="r2" />
            Курʼєр
          </div>
        </RadioGroup>
      )}
      {formData && formData.formStep >= 2 && (
        <div>
          <input
            className="mt-5 border border-gray-300"
            placeholder="Payment Details Object"
            id="paymentInfo"
            {...register('paymentInfo', { required: true })}
          />
          {errors.paymentInfo && <span>This field is required</span>}
        </div>
      )}
      {formData && formData.formStep >= 3 && (
        <div>
          <input
            className="mt-5 border border-gray-300"
            placeholder="comment"
            id="comment"
            {...register('comment', { required: true })}
          />
          {errors.comment && <span>This field is required</span>}
        </div>
      )}
      {formData && formData.formStep >= 4 && (
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('acceptTerms', { required: true })}
              id="acceptTerms"
              className={`form-check-input ${errors.acceptTerms ? 'is-invalid' : ''}`}
            />
            <span>Я погоджуюсь з умовами використання</span>
          </label>
          {errors.acceptTerms && <span>This field is required</span>}
          <label className="flex items-center space-x-3">
            <input type="checkbox" {...register('noCall')} id="doNotCall" />
            <span>Не телефонувати</span>
          </label>
        </div>
      )}
      {(!formData || (formData && formData.formStep) <= 3) && (
        <button type="submit" className="bg-black px-5 py-2 text-white">
          Продовжити
        </button>
      )}
    </form>
  )
})

CartForm.displayName = 'CartForm'

export default CartForm
