'use client'
import React, { FC, useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'
import { Button } from '@/components/admin/ui/button'
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
} from '@/components/client/ui/dialog'

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
  const router = useRouter()
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

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

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const result = await updateCategory(selectedCategory._id, data)

    if (result.success) {
      toast({
        title: result.message,
      })
    } else {
      toast({
        title: result.message,
      })
    }
    router.refresh()
  }

  const deleteCat = async () => {
    setIsConfirmDeleteOpen(false)
    const result = await deleteCategory(selectedCategory._id)

    if (result.success) {
      toast({
        title: result.message,
      })
    } else {
      toast({
        title: result.message,
      })
    }
    router.refresh()
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg border p-4"
      >
        <div className="flex justify-between gap-4">
          {languages.map((lang) => (
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
                <Label className="block font-bold">Опис:</Label>
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
