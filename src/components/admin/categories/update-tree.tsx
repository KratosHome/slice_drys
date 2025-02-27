'use client'
import React, { FC } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

interface UpdateTreeProps {
  selectedCategory: ICategory
}

interface FormData {
  name: string
  metaTitle: string
  description: string
  metaKeywords: string
  metaDescription: string
}

const UpdateTree: FC<UpdateTreeProps> = ({ selectedCategory }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: selectedCategory.name?.uk ?? '',
      metaTitle: selectedCategory.metaTitle?.uk ?? '',
      description: selectedCategory.description?.uk ?? '',
      metaKeywords: selectedCategory.metaKeywords?.uk ?? '',
      metaDescription: selectedCategory.metaDescription?.uk ?? '',
    },
  })

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.error('Це апдейт:', data)
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border p-4"
      >
        <div>
          <label className="block text-xl font-bold">Назва:</label>
          <input
            type="text"
            className="w-full border p-2"
            {...register('name', { required: 'Назва обовʼязкова' })}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block font-bold">Мета Заголовок:</label>
          <input
            type="text"
            className="w-full border p-2"
            {...register('metaTitle', {
              required: 'Мета заголовок обовʼязковий',
            })}
          />
          {errors.metaTitle && (
            <p className="text-sm text-red-500">{errors.metaTitle.message}</p>
          )}
        </div>

        <div>
          <label className="block font-bold">Опис:</label>
          <textarea
            className="w-full border p-2"
            {...register('description', { required: 'Опис обовʼязковий' })}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block font-bold">Ключові слова:</label>
          <input
            type="text"
            className="w-full border p-2"
            {...register('metaKeywords', {
              required: 'Ключові слова обовʼязкові',
            })}
          />
          {errors.metaKeywords && (
            <p className="text-sm text-red-500">
              {errors.metaKeywords.message}
            </p>
          )}
        </div>

        <div>
          <label className="block font-bold">Мета Опис:</label>
          <textarea
            className="w-full border p-2"
            {...register('metaDescription', {
              required: 'Мета опис обовʼязковий',
            })}
          />
          {errors.metaDescription && (
            <p className="text-sm text-red-500">
              {errors.metaDescription.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Зберегти
        </button>
      </form>
    </div>
  )
}

export default UpdateTree
