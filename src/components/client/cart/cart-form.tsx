'use client'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import useFormStore from './formStore'

interface FormData {
  name: string
  surname: string
  phoneNumber: string
  email: string
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
      // Якщо є дані, встановлюємо їх у поля форми
      setValue('name', formData.name)
      setValue('surname', formData.surname)
      setValue('phoneNumber', formData.phoneNumber)
      setValue('email', formData.email)
    }
  }, [formData, setValue])

  const onSubmit = (data: FormData) => {
    setFormData(data)
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
      <button type="submit" className="bg-black px-5 py-2 text-white">
        Submit
      </button>
    </form>
  )
}

export default CartForm
