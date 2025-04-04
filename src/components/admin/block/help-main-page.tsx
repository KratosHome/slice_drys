'use client'
import React, { FC, useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useForm, SubmitHandler } from 'react-hook-form'
import { updateHelpData } from '@/server/block/update-help-main.server'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { convertToBase64 } from '@/utils/convertToBase64'
import { Button } from '@/components/ui/button'

interface FormValues {
  title_en: string
  title_uk: string
  description_en: string
  description_uk: string
  buttonName_en: string
  buttonName_uk: string
  link: string
}

interface HelpMainPageProps {
  data: IHelp
}

const HelpMainPage: FC<HelpMainPageProps> = ({ data }) => {
  const router = useRouter()
  const [imageFiles, setImageFiles] = useState<string[]>([])

  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      title_en: data?.title?.en || '',
      title_uk: data?.title?.uk || '',
      description_en: data?.content?.en || '',
      description_uk: data?.content?.uk || '',
      buttonName_en: data?.button?.en || '',
      buttonName_uk: data?.button?.uk || '',
      link: data?.link || '',
    },
  })

  useEffect(() => {
    if (data) {
      setValue('title_en', data.title?.en || '')
      setValue('title_uk', data.title?.uk || '')
      setValue('description_en', data.content?.en || '')
      setValue('description_uk', data.content?.uk || '')
      setValue('buttonName_en', data.button?.en || '')
      setValue('buttonName_uk', data.button?.uk || '')
      setValue('link', data.link || '')
    }
  }, [data, setValue])

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files) return

    const files = Array.from(event.target.files)
    const base64Images = await Promise.all(
      files.map((file) => convertToBase64(file)),
    )
    setImageFiles(base64Images)
  }

  const onSubmit: SubmitHandler<FormValues> = async (formData) => {
    const sendData = {
      title: {
        en: formData.title_en,
        uk: formData.title_uk,
      },
      content: {
        en: formData.description_en,
        uk: formData.description_uk,
      },
      button: {
        en: formData.buttonName_en,
        uk: formData.buttonName_uk,
      },
      link: formData.link,
    }

    const result = await updateHelpData(sendData, imageFiles)

    toast({ title: result.message })
    router.refresh()
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Заголовок (EN)</Label>
          <Input
            {...register('title_en', { required: 'Це поле обов’язкове' })}
          />
        </div>
        <div>
          <Label>Заголовок (UK)</Label>
          <Input
            {...register('title_uk', { required: 'Це поле обов’язкове' })}
          />
        </div>
        <div>
          <Label>Опис (EN)</Label>
          <Input
            {...register('description_en', { required: 'Це поле обов’язкове' })}
          />
        </div>
        <div>
          <Label>Опис (UK)</Label>
          <Input
            {...register('description_uk', { required: 'Це поле обов’язкове' })}
          />
        </div>
        <div>
          <Label>Назва кнопки (EN)</Label>
          <Input
            {...register('buttonName_en', { required: 'Це поле обов’язкове' })}
          />
        </div>
        <div>
          <Label>Назва кнопки (UK)</Label>
          <Input
            {...register('buttonName_uk', { required: 'Це поле обов’язкове' })}
          />
        </div>
        <div>
          <Label>Посилання</Label>
          <Input {...register('link', { required: 'Це поле обов’язкове' })} />
        </div>
        <div>
          <Label>Завантаження зображень (2-5)</Label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
        <Button type="submit">Відправити</Button>
      </form>
    </div>
  )
}

export default HelpMainPage
