'use client'
import React, { FC, useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/admin/ui/alert-dialog'
import { Label } from '@/components/admin/ui/label'
import { Input } from '@/components/admin/ui/input'
import { Button } from '@/components/admin/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/admin/ui/radio-group'
import { convertToBase64 } from '@/utils/convertToBase64'
import Image from 'next/image'

import QuillEditor from './quill-editor'
import 'quill/dist/quill.snow.css'
import { createPost } from '@/server/posts/create-post.server'

interface ICratePost {
  buttonTitle: string
  post?: IPostLocal
}

const EditorPost: FC<ICratePost> = ({ buttonTitle, post }) => {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const [contentError, setContentError] = useState<string | null>(null)
  const [slug, setSlug] = useState<string>(post?.slug || '')
  const [quillEditorLanguage, setQuillEditorLanguage] = useState<'en' | 'uk'>(
    'en',
  )
  const [isOpen, setIsOpen] = useState(false)
  const [postContent, setPostContent] = useState<ILocalizedString>({
    en: post?.content?.en ?? '',
    uk: post?.content?.uk ?? '',
  })

  const [quillEditorContent, setQuillEditorContent] = useState<string>(
    postContent.en,
  )

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<IPostLocal>({
    defaultValues: {
      content: { en: '', uk: '' },
      title: { en: '', uk: '' },
      slug: post?.slug,
      date: new Date(),
      author: { en: '', uk: '' },
      keywords: { en: [], uk: [] },
      metaDescription: { en: '', uk: '' },
    },
  })
  useEffect(() => {
    let url: string | null = null

    if (imageFile) {
      url = URL.createObjectURL(imageFile)
      setImagePreviewUrl(url)
    } else if (post?.img) {
      setImagePreviewUrl(post.img)
    } else {
      setImagePreviewUrl(null)
    }
  }, [imageFile, post?.img])

  useEffect(() => {
    setValue('content', postContent)
    if (post) {
      setValue('slug', slug)

      setValue('date', post.date)
      setValue('title', post.title)
      setValue('author', post.author)
      setValue('metaDescription', post.metaDescription)
      setValue('keywords', post.keywords)
    } else if (!post) {
      setValue('slug', slug)
    }
  }, [postContent, setValue, post, slug])

  const onSubmit = async (data: IPostLocal) => {
    if (data.content) {
      data.content[quillEditorLanguage] = await quillEditorContent

      const image = imageFile ? await convertToBase64(imageFile) : ''

      if (!data.content.en || !data.content.uk) {
        setContentError('Контент на обох мовах є обов’язковим')

        return
      } else {
        setContentError(null)

        createPost(data, image)

        setIsOpen(false)
      }
    }
  }

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === 'en' && event.target.checked) {
      setQuillEditorLanguage(event.target.value)
      setPostContent({ ...postContent, uk: quillEditorContent })
      setQuillEditorContent(postContent.en)
    } else if (event.target.value === 'uk' && event.target.checked) {
      setQuillEditorLanguage(event.target.value)
      setPostContent({ ...postContent, en: quillEditorContent })
      setQuillEditorContent(postContent.uk)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button>{buttonTitle}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>{buttonTitle} товар</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <div className="max-h-[80svh] space-y-4 overflow-auto p-2">
                <div className="flex justify-between">
                  <div>
                    <Label htmlFor="picture">Додати зображення</Label>
                    <Input
                      id="picture"
                      type="file"
                      onChange={handleImageChange}
                    />
                  </div>

                  {imagePreviewUrl && (
                    <div>
                      <Label>Прев’ю </Label>
                      <Image
                        src={imagePreviewUrl}
                        width={100}
                        height={100}
                        alt="Зображення продукту"
                        className="rounded-md"
                      />
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <div>
                    <Label htmlFor="title-uk">Заголовок (UK)</Label>
                    <Input
                      id="title-uk"
                      {...register('title.uk', {
                        required: 'Це поле є обов’язковим',
                      })}
                    />
                    {errors.title?.uk && (
                      <span className="text-red">
                        {errors.title.uk.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="title-en">Заголовок (EN)</Label>
                    <Input
                      id="title-en"
                      {...register('title.en', {
                        required: 'Це поле є обов’язковим',
                        onChange: (event) => {
                          if (post && post.title) {
                            post.title.en = event.target.value
                          }

                          setSlug(
                            event.target.value
                              .toLowerCase()
                              .trim()
                              .replace(/[^\w\s-]/g, '')
                              .replace(/\s+/g, '-'),
                          )
                        },
                      })}
                    />
                    {errors.title?.en && (
                      <span className="text-red">
                        {errors.title.en.message}
                      </span>
                    )}
                  </div>
                </div>
                <RadioGroup defaultValue="en" onChange={handleRadioChange}>
                  <div className="start flex gap-4">
                    <div className="flex gap-1">
                      <Label>Контент</Label>
                    </div>
                    <div className="flex gap-1">
                      <Label>en</Label>
                      <RadioGroupItem value="en"> </RadioGroupItem>
                    </div>
                    <div className="flex gap-1">
                      <Label>uk</Label>
                      <RadioGroupItem value="uk"></RadioGroupItem>
                    </div>
                    {contentError && (
                      <span className="text-red">{contentError}</span>
                    )}
                  </div>
                </RadioGroup>
                <QuillEditor
                  content={quillEditorContent}
                  setContent={setQuillEditorContent}
                />

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    value={slug}
                    id="slug"
                    {...register('slug', {
                      required: 'Це поле є обов’язковим',
                      onChange: (event) => {
                        setSlug(event.target.value)
                      },
                    })}
                  />
                  {errors.slug && (
                    <span className="text-red">{errors.slug.message}</span>
                  )}
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    {...register('date', {
                      required: 'Це поле є обов’язковим',
                    })}
                  />
                  {errors.date && (
                    <span className="text-red">{errors.date.message}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <div>
                    <Label htmlFor="author-uk">Автор (UK)</Label>
                    <Input
                      id="author-uk"
                      {...register('author.uk', {
                        required: 'Це поле є обов’язковим',
                      })}
                    />
                    {errors.author?.uk && (
                      <span className="text-red">
                        {errors.author.uk.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="author-en">Автор (EN)</Label>
                    <Input
                      id="author-en"
                      {...register('author.en', {
                        required: 'Це поле є обов’язковим',
                      })}
                    />
                    {errors.author?.en && (
                      <span className="text-red">
                        {errors.author.en.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <Label htmlFor="keywords-uk">Ключові слова (UK)</Label>
                    <Input
                      id="keywords-uk"
                      {...register('keywords.uk', {
                        required: 'Це поле є обов’язковим',
                      })}
                    />
                    {errors.keywords?.uk && (
                      <span className="text-red">
                        {errors.keywords.uk.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="keywords-en">Ключові слова (EN)</Label>
                    <Input
                      id="keywords-en"
                      {...register('keywords.en', {
                        required: 'Це поле є обов’язковим',
                      })}
                    />
                    {errors.keywords?.en && (
                      <span className="text-red">
                        {errors.keywords.en.message}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <Label htmlFor="meta-description-uk">Мета опис (UK)</Label>
                    <Input
                      id="meta-description-uk"
                      {...register('metaDescription.uk', {
                        required: 'Це поле є обов’язковим',
                      })}
                    />
                    {errors.metaDescription?.uk && (
                      <span className="text-red">
                        {errors.metaDescription.uk.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="meta-description-en">Мета опис (EN)</Label>
                    <Input
                      id="meta-description-en"
                      {...register('metaDescription.en', {
                        required: 'Це поле є обов’язковим',
                      })}
                    />
                    {errors.metaDescription?.en && (
                      <span className="text-red">
                        {errors.metaDescription.en.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter>
              <Button type="submit">{buttonTitle}</Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default EditorPost
