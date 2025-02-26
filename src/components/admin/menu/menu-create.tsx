'use client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/client/ui/dialog'
import React, { FC, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Label } from '@/components/admin/ui/label'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/admin/ui/select'
import { Button } from '@/components/admin/ui/button'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { toast } from '@/hooks/use-toast'
import { createMenu } from '@/server/menu/create-menu.server'

interface MenuProps {
  categories: ICategory[]
}

interface FormData {
  name_en: string
  name_uk: string
  type: string
  slug: string
}

const MenuCreateDialog: FC<MenuProps> = ({ categories }) => {
  const router = useRouter()
  const locale = useLocale() as ILocale

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>()

  const [open, setOpen] = useState(false)

  useEffect(() => {
    register('type', { required: 'Type is required' })
  }, [register])

  const onSubmit = async (data: FormData) => {
    const formattedData = {
      name: {
        en: data.name_en,
        uk: data.name_uk,
      },
      slug: data.slug,
      categories: [data.type],
    }

    const result = await createMenu(formattedData)

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
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Menu Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name_en">Name (English)</Label>
            <Input
              id="name_en"
              {...register('name_en', {
                required: 'Name in English is required',
              })}
            />
            {errors.name_en && (
              <p className="text-sm text-red-500">{errors.name_en.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="name_uk">Name (Ukrainian)</Label>
            <Input
              id="name_uk"
              {...register('name_uk', {
                required: 'Name in Ukrainian is required',
              })}
            />
            {errors.name_uk && (
              <p className="text-sm text-red-500">{errors.name_uk.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              onValueChange={(value) =>
                setValue('type', value, { shouldValidate: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category._id}
                    value={category._id.toString()}
                  >
                    {category.name[locale] ?? category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
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
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default MenuCreateDialog
