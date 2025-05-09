'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import CategoryTreeCheckbox from '@/components/admin/categories/category-tree-checkbox'
import { Label } from '@/components/ui/label'
import QuillEditor from '@/components/admin/quill-editor/d-quill-editor'

import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { createCategory } from '@/server/categories/create-categories.server'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { locales } from '@/data/locales'
import { Button } from '@/components/ui/button'

interface ICategoriesTreeProps {
  categories: ICategory[]
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
}

const CreateCategories = ({ categories }: ICategoriesTreeProps) => {
  const router = useRouter()

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const [isOpen, setIsOpen] = useState<boolean>(false)

  const [descriptionUk, setDescriptionUk] = useState<string>('')
  const [descriptionEn, setDescriptionEn] = useState<string>('')

  const handleCategoryChange = (categoryId: string): void => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? [] : [categoryId],
    )
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormData>()

  const onSubmit: SubmitHandler<IFormData> = async (data) => {
    type CreateCategoryDTO = Omit<ICategory, '_id' | 'children'>

    const formattedData: CreateCategoryDTO = {
      name: data.name,
      slug: data.name.uk.toLowerCase().replace(/\s+/g, '-'),
      description: {
        uk: descriptionUk,
        en: descriptionEn,
      },
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaKeywords: data.metaKeywords,
      order: 0,
      parentCategory: selectedCategories.length
        ? selectedCategories[0]
        : undefined,
    }

    const result = await createCategory(formattedData)

    if (result.success) {
      setIsOpen(false)
      toast({
        title: result.message,
      })
    } else {
      toast({
        title: result.message,
      })
    }

    router.refresh()
    reset()
  }

  return (
    <div className="ml-6">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create</Button>
        </DialogTrigger>

        <DialogContent className="max-h-screen overflow-auto">
          <DialogHeader>
            <DialogTitle>Create categories</DialogTitle>

            <DialogDescription>
              Choose the categories you want to create
            </DialogDescription>
          </DialogHeader>

          <div className="text-center">
            Оберіть батьківську категорію <br />
            (якщо не обрати ви створите корневу меню)
          </div>

          <div className="max-h-[300px] overflow-auto border">
            <CategoryTreeCheckbox
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-lg border p-4"
          >
            <div className="flex justify-between gap-2">
              {locales.map((lang) => (
                <div key={lang} className="mb-4 border-b pb-4">
                  <h3 className="text-lg font-bold uppercase">
                    {lang === 'uk' ? 'Українська' : 'English'}
                  </h3>

                  <div>
                    <label className="block text-xl font-bold">Назва:</label>

                    <input
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
            <Button type="submit">Зберегти</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateCategories
