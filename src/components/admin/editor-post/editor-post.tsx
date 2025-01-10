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
import { RadioGroup, RadioGroupItem } from '@/components/admin/ui/radio-group'
import { convertToBase64 } from '@/utils/convertToBase64'
import Image from 'next/image'

import QuillEditor from './quill-editor'
import 'quill/dist/quill.snow.css'
import { createPost } from '@/server/posts/create-post.server'
import { editPost } from '@/server/posts/edit-post'
import { Button } from '@/components/admin/ui/button'
import { useToast } from '@/hooks/use-toast'
import { toSlug } from '@/utils/toSlug'

interface ICratePost {
  buttonTitle: string
  post?: IPostLocal
}

const EditorPost: FC<ICratePost> = ({ buttonTitle, post }) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

  const { toast } = useToast()
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
      img: '',
      slug: post?.slug,
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
      setValue('img', post.img)
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
      data.content[quillEditorLanguage] = quillEditorContent
    }
    const image = imageFile ? await convertToBase64(imageFile) : ''

    if (!data.content.en || !data.content.uk) {
      setContentError('Контент на обох мовах є обов’язковим')

      return
    } else {
      setContentError(null)
      console.log(post?._id)
      let response
      if (post?._id) {
        response = await editPost(post._id, data, image)
      } else {
        response = await createPost(data, image)
      }

      if (response.success) {
        setIsOpen(false)
        toast({
          duration: 3000,
          title: 'Post created successfully',
        })
      } else {
        toast({
          variant: 'destructive',
          title: 'Error creating post',
          description: response.message,
        })
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
  const handleDelete = async () => {
    console.log('delete')
  }

  const ConfirmDeletePopup = () => (
    <AlertDialog
      open={isConfirmDeleteOpen}
      onOpenChange={setIsConfirmDeleteOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Видалення</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>
          Дійсно хочете видалити цей товар?
        </AlertDialogDescription>

        <AlertDialogFooter>
          <div className="flex w-full justify-end gap-3">
            <Button variant="destructive" onClick={handleDelete}>
              Так
            </Button>

            <Button
              variant="default"
              onClick={() => setIsConfirmDeleteOpen(false)}
            >
              Ні
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  return (
    <div>
      <ConfirmDeletePopup />
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button>{buttonTitle}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>{buttonTitle} пост</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription>
              <div className="max-h-[80svh] space-y-4 overflow-auto p-2">
                <div className="flex justify-between">
                  <div>
                    <Label htmlFor="picture">Додати зображення</Label>
                    <Input
                      id="picture"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>

                  {imagePreviewUrl && (
                    <div>
                      <Label>Прев’ю </Label>
                      <Image
                        src={imagePreviewUrl}
                        width={50}
                        height={50}
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
                      placeholder="..."
                      {...register('title.uk', {
                        minLength: {
                          value: 30,
                          message: 'Мінімумум 30 символів',
                        },
                        maxLength: {
                          value: 60,
                          message: 'Максимум 60 символів',
                        },
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
                      maxLength={255}
                      placeholder="..."
                      {...register('title.en', {
                        minLength: {
                          value: 30,
                          message: 'Мінімумум 30 символів',
                        },
                        maxLength: {
                          value: 60,
                          message: 'Максимум 60 символів',
                        },
                        required: 'Це поле є обов’язковим',
                        onChange: (event) => {
                          if (post && post.title) {
                            post.title.en = event.target.value
                          }
                          setSlug(toSlug(event.target.value))
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
                  className="min-h-64"
                  content={quillEditorContent}
                  setContent={setQuillEditorContent}
                />

                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    value={slug}
                    id="slug"
                    maxLength={255}
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
                <div className="flex justify-between">
                  <div>
                    <Label htmlFor="author-uk">Автор (UK)</Label>
                    <Input
                      id="author-uk"
                      {...register('author.uk', {
                        minLength: {
                          value: 3,
                          message: 'Мінімум 3 символи',
                        },
                        maxLength: {
                          value: 50,
                          message: 'Максимум 50 символів',
                        },
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
                        minLength: {
                          value: 3,
                          message: 'Мінімум 3 символи',
                        },
                        maxLength: {
                          value: 50,
                          message: 'Максимум 50 символів',
                        },
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
                        minLength: {
                          value: 5,
                          message: 'Мінімум 5 символів',
                        },
                        maxLength: {
                          value: 255,
                          message: 'Максимум 255 символів',
                        },
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
                        minLength: {
                          value: 5,
                          message: 'Мінімум 5 символів',
                        },
                        maxLength: {
                          value: 255,
                          message: 'Максимум 255 символів',
                        },
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
                        minLength: {
                          value: 50,
                          message: 'Мінімум 50 символів',
                        },
                        maxLength: {
                          value: 160,
                          message: 'Максимум 160 символів',
                        },
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
                        minLength: {
                          value: 50,
                          message: 'Мінімум 50 символів',
                        },
                        maxLength: {
                          value: 160,
                          message: 'Максимум 160 символів',
                        },
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
              {post ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setIsConfirmDeleteOpen(true)}
                >
                  Видалити
                </Button>
              ) : (
                <div />
              )}
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Скасувати
              </Button>
              <Button type="submit">{buttonTitle}</Button>{' '}
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default EditorPost
