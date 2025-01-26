'use client'

import React, { useEffect, forwardRef, useImperativeHandle } from 'react'
import { useForm } from 'react-hook-form'
import { useCartStore } from '@/store/cartStore'

interface FormData {
  name: string
  surname: string
  phoneNumber: string
  email: string
  deliveryInfo: string
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
      setValue('deliveryInfo', formData.deliveryInfo)
      setValue('paymentInfo', formData.paymentInfo)
      setValue('comment', formData.comment)
      setValue('acceptTerms', formData.acceptTerms)
      setValue('noCall', formData.noCall)
    }
  }, [formData, setValue])

  const onSubmit = (data: FormData) => {
    const partialData = {
      name: data.name,
      surname: data.surname,
      phoneNumber: data.phoneNumber,
      email: data.email,
      formStep:
        formData && formData.formStep !== null
          ? formData.formStep < 4
            ? formData.formStep + 1
            : formData.formStep
          : 1,
      deliveryInfo: data.deliveryInfo,
      paymentInfo: data.paymentInfo,
      comment: data.comment,
      acceptTerms: data.acceptTerms,
      noCall: data.noCall,
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
          {...register('email', { required: true })}
        />
        {errors.email && <span>This field is required</span>}
      </div>
      {formData && formData.formStep >= 1 && (
        <div>
          <input
            className="mt-5 border border-gray-300"
            placeholder="Delivery Details Object"
            id="deliveryInfo"
            {...register('deliveryInfo', { required: true })}
          />
          {errors.deliveryInfo && <span>This field is required</span>}
        </div>
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
