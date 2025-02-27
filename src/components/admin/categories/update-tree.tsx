'use client'
import React, { FC, useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'

interface UpdateTreeProps {
  selectedCategory: ICategory
}

interface FormData {
  name: {
    uk: string
    en: string
  }
  metaTitle: {
    uk: string
    en: string
  }
  description: {
    uk: string
    en: string
  }
  metaKeywords: {
    uk: string
    en: string
  }
  metaDescription: {
    uk: string
    en: string
  }
}

const UpdateTree: FC<UpdateTreeProps> = ({ selectedCategory }) => {
  const languages = ['uk', 'en'] as ILocale[]

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  useEffect(() => {
    reset({
      name: {
        uk: selectedCategory.name?.uk ?? '',
        en: selectedCategory.name?.en ?? '',
      },
      metaTitle: {
        uk: selectedCategory.metaTitle?.uk ?? '',
        en: selectedCategory.metaTitle?.en ?? '',
      },
      description: {
        uk: selectedCategory.description?.uk ?? '',
        en: selectedCategory.description?.en ?? '',
      },
      metaKeywords: {
        uk: selectedCategory.metaKeywords?.uk ?? '',
        en: selectedCategory.metaKeywords?.en ?? '',
      },
      metaDescription: {
        uk: selectedCategory.metaDescription?.uk ?? '',
        en: selectedCategory.metaDescription?.en ?? '',
      },
    })
  }, [selectedCategory, reset])

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.error('Це апдейт:', data)
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border p-4"
      >
        <div className="flex justify-between gap-2">
          {languages.map((lang) => (
            <div key={lang} className="mb-4 border-b pb-4">
              <h3 className="text-lg font-bold uppercase">
                {lang === 'uk' ? 'Українська' : 'English'}
              </h3>
              <div>
                <label className="block text-xl font-bold">Назва:</label>
                <input
                  type="text"
                  className="w-full border p-2"
                  // Використовуємо каст для літерального типу
                  {...register(`name.${lang}`, {
                    required: 'Назва обовʼязкова',
                  })}
                />
                {errors.name?.[lang] && (
                  <p className="text-sm text-red-500">
                    {errors.name[lang]?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold">Мета Заголовок:</label>
                <input
                  type="text"
                  className="w-full border p-2"
                  {...register(`metaTitle.${lang}`, {
                    required: 'Мета заголовок обовʼязковий',
                  })}
                />
                {errors.metaTitle?.[lang] && (
                  <p className="text-sm text-red-500">
                    {errors.metaTitle[lang]?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold">Опис:</label>
                <textarea
                  className="w-full border p-2"
                  {...register(`description.${lang}`, {
                    required: 'Опис обовʼязковий',
                  })}
                />
                {errors.description?.[lang] && (
                  <p className="text-sm text-red-500">
                    {errors.description[lang]?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold">Ключові слова:</label>
                <input
                  type="text"
                  className="w-full border p-2"
                  {...register(`metaKeywords.${lang}`, {
                    required: 'Ключові слова обовʼязкові',
                  })}
                />
                {errors.metaKeywords?.[lang] && (
                  <p className="text-sm text-red-500">
                    {errors.metaKeywords[lang]?.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold">Мета Опис:</label>
                <textarea
                  className="w-full border p-2"
                  {...register(`metaDescription.${lang}`, {
                    required: 'Мета опис обовʼязковий',
                  })}
                />
                {errors.metaDescription?.[lang] && (
                  <p className="text-sm text-red-500">
                    {errors.metaDescription[lang]?.message}
                  </p>
                )}
              </div>
            </div>
          ))}
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
