'use client'
import React, { FC, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { deleteCategory } from '@/server/categories/delete-category.server'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { updateCategory } from '@/server/categories/update-category.server'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import Image from 'next/image'
import QuillEditor from '@/components/admin/quill-editor'

import { type ChangeEvent, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { deleteCategory } from '@/server/categories/delete-category.server'
import { updateCategory } from '@/server/categories/update-category.server'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { convertToBase64 } from '@/utils/convertToBase64'
import QuillEditor from '@/components/admin/editor-post/quill-editor'
import { Button } from '@/components/ui/button'

interface IUpdateTreeProps {
  selectedCategory: ICategory
}

interface IFormData {
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
  slug: string
}

const UpdateTree = ({ selectedCategory }: IUpdateTreeProps) => {
  const router = useRouter()

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState<boolean>(false)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const [descriptionUk, setDescriptionUk] = useState<string>('')
  const [descriptionEn, setDescriptionEn] = useState<string>('')

  useEffect(() => {
    let url: string | null = null

    if (imageFile) {
      url = URL.createObjectURL(imageFile)
      setImagePreviewUrl(url)
    } else if (selectedCategory?.image) {
      setImagePreviewUrl(selectedCategory.image)
    } else {
      setImagePreviewUrl(null)
    }
  }, [imageFile, selectedCategory?.image])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormData>()

  useEffect(() => {
    setDescriptionUk(selectedCategory.description?.uk ?? '')
    setDescriptionEn(selectedCategory.description?.en ?? '')
  }, [selectedCategory.description])

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
      metaKeywords: {
        uk: selectedCategory.metaKeywords?.uk ?? '',
        en: selectedCategory.metaKeywords?.en ?? '',
      },
      description: {
        uk: selectedCategory.description?.uk ?? '',
        en: selectedCategory.description?.en ?? '',
      },
      metaDescription: {
        uk: selectedCategory.metaDescription?.uk ?? '',
        en: selectedCategory.metaDescription?.en ?? '',
      },
      slug: selectedCategory.slug ?? '',
    })
  }, [selectedCategory, reset])

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    const image: string = imageFile ? await convertToBase64(imageFile) : ''

    data.description.uk = descriptionUk
    data.description.en = descriptionEn

    const result = await updateCategory(selectedCategory._id, data, image)

    toast({ title: result.message })
    router.refresh()
  }

  const deleteCat = async (): Promise<void> => {
    setIsConfirmDeleteOpen(false)

    const result: IResponse = await deleteCategory(selectedCategory._id)

    toast({ title: result.message })
    router.refresh()
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file: File | undefined = event.target.files?.[0]

    if (file) setImageFile(file)
  }

  return (
    <div>
      <div>
        {imagePreviewUrl && (
          <div>
            <Label>Попередній перегляд зображення</Label>

            <Image
              src={imagePreviewUrl}
              width={100}
              height={100}
              alt="Зображення категорії"
              className="rounded-md"
            />
          </div>
        )}

        <Label htmlFor="picture">Додати зображення</Label>

        <Input id="picture" type="file" onChange={handleImageChange} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-3">
          <Label className="block font-bold">Посилання:</Label>

          <Input
            type="text"
            className="w-full border p-2"
            {...register(`slug`, {
              required: 'Ключові слова обовʼязкові',
            })}
          />

          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug?.message}</p>
          )}
        </div>

        <div className="flex justify-between gap-4">
          {locales.map((lang) => (
            <div key={lang} className="mb-4 w-full border-b pb-4">
              <h3 className="text-lg font-bold uppercase">
                {lang === 'uk' ? 'Українська' : 'English'}
              </h3>

              <div className="mt-3">
                <Label className="block text-xl font-bold">Назва:</Label>

                <Input
                  type="text"
                  className="w-full border p-2"
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

              <div className="mt-3">
                <Label className="block font-bold">Мета Заголовок:</Label>

                <Input
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

              <div className="mt-3">
                <Label className="block">Опис:</Label>

                {lang === 'uk' ? (
                  <QuillEditor
                    className="min-h-96"
                    content={descriptionUk}
                    setContent={setDescriptionUk}
                  />
                ) : (
                  <QuillEditor
                    className="min-h-96"
                    content={descriptionEn}
                    setContent={setDescriptionEn}
                  />
                )}
              </div>

              <div className="mt-3">
                <Label className="block font-bold">Ключові слова:</Label>

                <Input
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

              <div className="mt-3">
                <Label className="block font-bold">Мета Опис:</Label>

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

        <div className="flex justify-between">
          <Button type="submit">Зберегти</Button>

          <Button
            variant="destructive"
            onClick={() => setIsConfirmDeleteOpen(true)}
          >
            Видалити
          </Button>
        </div>
      </form>

      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Ви впевнені, що хочете видалити цю категорію?
            </DialogTitle>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={() => setIsConfirmDeleteOpen(false)}>
              Скасувати
            </Button>

            <Button variant="destructive" onClick={deleteCat}>
              Видалити
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdateTree
