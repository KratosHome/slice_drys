'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useFormStore from './formStore'

interface FormData {
  name: string
  surname: string
  phoneNumber: string
  email: string
  deliveryInfo: string
  paymentInfo: string
}

const CartForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>()

  const setFormData = useFormStore((state) => state.setFormData)
  const formData = useFormStore((state) => state.formData) // Отримуємо поточні дані форми з store

  useEffect(() => {
    if (formData) {
      setValue('name', formData.name)
      setValue('surname', formData.surname)
      setValue('phoneNumber', formData.phoneNumber)
      setValue('email', formData.email)
      setValue('deliveryInfo', formData.deliveryInfo)
      setValue('paymentInfo', formData.paymentInfo)
    }
  }, [formData, setValue])

  const onSubmit = (data: FormData) => {
    const partialData = {
      name: data.name,
      surname: data.surname,
      phoneNumber: data.phoneNumber,
      email: data.phoneNumber,
      formStep:
        formData && formData.formStep !== null ? formData.formStep + 1 : 1,
      deliveryInfo: data.deliveryInfo,
      paymentInfo: data.paymentInfo,
    }
    setFormData(partialData)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          {...register('phoneNumber', { required: true })}
        />
        {errors.phoneNumber && <span>This field is required</span>}
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
      {formData && formData.formStep >= 1 ? (
        <div>
          <input
            className="mt-5 border border-gray-300"
            placeholder="Delivery Details Object"
            id="deliveryInfo"
            {...register('deliveryInfo', { required: true })}
          />{' '}
          {errors.deliveryInfo && <span>This field is required</span>}
        </div>
      ) : (
        ''
      )}
      {formData && formData.formStep >= 2 ? (
        <div>
          <input
            className="mt-5 border border-gray-300"
            placeholder="Delivery Details Object"
            id="paymentInfo"
            {...register('paymentInfo', { required: true })}
          />{' '}
          {errors.paymentInfo && <span>This field is required</span>}
        </div>
      ) : (
        ''
      )}
      <button type="submit" className="bg-black px-5 py-2 text-white">
        Продовжити
      </button>
    </form>
  )
}

export default CartForm
