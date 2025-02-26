'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { TabsContent } from '@/components/admin/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/admin/ui/select'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { useLocale } from 'next-intl'
import { deleteMenu } from '@/server/menu/delete-menu.server'
import { toast } from '@/hooks/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/admin/ui/alert-dialog'
import { useRouter } from 'next/navigation'
import { updateMenu } from '@/server/menu/update-menu.server'

type FormData = {
  name: {
    en: string
    uk: string
  }
  slug: string
}

const MenuCategorySelect = ({
  menu,
  categories,
}: {
  menu: IMenu
  categories: ICategory[]
}) => {
  const router = useRouter()
  const locale = useLocale() as ILocale

  const [selectedCategory, setSelectedCategory] = useState(
    menu.categories?.[0]?._id.toString() || '',
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: {
        en: menu.name?.en || '',
        uk: menu.name?.uk || '',
      },
      slug: menu.slug || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    const updateData = {
      id: menu._id,
      name: {
        en: data.name.en,
        uk: data.name.uk,
      },
      slug: data.slug,
      categories: [selectedCategory],
    }

    const result = await updateMenu(updateData)

    if (result.success) {
      toast({
        title: result.message,
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Помилка оновлення меню',
        description: result.message,
      })
    }

    router.refresh()
  }

  const onDelete = async () => {
    const result = await deleteMenu(menu._id)

    if (result.success) {
      toast({
        title: result.message,
      })
    } else {
      toast({
        variant: 'destructive',
        title: result.message,
        description: result.message,
      })
    }

    router.refresh()
  }

  return (
    <TabsContent key={menu.slug} value={menu.slug}>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Виберіть категорію" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category._id} value={category._id.toString()}>
              {category.name[locale]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <Input
            className={`mt-2 ${errors.name?.en ? 'border-red-500' : ''}`}
            placeholder="Name (English)"
            {...register('name.en', {
              required: 'Назва англійською не може бути порожньою',
              minLength: {
                value: 3,
                message: 'Мінімальна довжина - 3 символи',
              },
            })}
          />
          {errors.name?.en && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.en.message}
            </p>
          )}
        </div>
        <div>
          <Input
            className={`mt-2 ${errors.name?.uk ? 'border-red-500' : ''}`}
            placeholder="Назва (Українською)"
            {...register('name.uk', {
              required: 'Назва українською не може бути порожньою',
              minLength: {
                value: 3,
                message: 'Мінімальна довжина - 3 символи',
              },
            })}
          />
          {errors.name?.uk && (
            <p className="mt-1 text-sm text-red-500">
              {errors.name.uk.message}
            </p>
          )}
        </div>
        <div>
          <Input
            className={`mt-2 ${errors.slug ? 'border-red-500' : ''}`}
            placeholder="slug"
            {...register('slug', {
              required: 'Slug не може бути порожнім',
              minLength: {
                value: 3,
                message: 'Slug повинен містити мінімум 3 символи',
              },
              pattern: {
                value: /^[a-z0-9-]+$/,
                message: 'Slug може містити лише малі літери, цифри та дефіс',
              },
            })}
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>
        <div className="mt-2 flex gap-2">
          <Button type="submit">Save</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button type="button" variant="destructive">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Ви впевнені?</AlertDialogTitle>
                <AlertDialogDescription>
                  Це видалить меню <b>{menu.slug}</b> без можливості
                  відновлення.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Скасувати</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>
                  Видалити
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </TabsContent>
  )
}

export default MenuCategorySelect
