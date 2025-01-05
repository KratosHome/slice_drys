'use client'
import React, { FC, useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import Loading from '@/components/admin/ui/loading'
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

import QuillEditor from './quill-editor'
import 'quill/dist/quill.snow.css'
import { createPost } from '@/server/posts/create-post.server'

interface ICratePost {
  buttonTitle: string
  post?: IPostLocal
}

const EditorPost: FC<ICratePost> = ({ buttonTitle, post }) => {
  const [contentError, setContentError] = useState<string | null>(null)
  const [slug, setSlug] = useState<string>('')
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
      slug: '',
      date: new Date(),
    },
  })

  useEffect(() => {
    setValue('content', postContent)
    setValue('slug', slug)

    if (post) {
      setValue('slug', post.slug)
      setValue('date', post.date)
      setValue('title', post.title)
    }
  }, [postContent, setValue, post, slug])

  const onSubmit = async (data: IPostLocal) => {
    if (data.content) {
      data.content[quillEditorLanguage] = await quillEditorContent

      if (!data.content.en || !data.content.uk) {
        setContentError('Контент на обох мовах є обов’язковим')

        return
      } else {
        setContentError(null)
        createPost(data)
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
      // console.log(quillEditorContent)
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
                    <Label htmlFor="name-uk">Заголовок (UK)</Label>
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
                        onChange: (event) =>
                          setSlug(
                            event.target.value
                              .toLowerCase()
                              .trim()
                              .replace(/[^\w\s-]/g, '')
                              .replace(/\s+/g, '-'),
                          ),
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
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  value={slug}
                  id="slug"
                  {...register('slug', {
                    required: 'Це поле є обов’язковим',
                    onChange: (event) => {
                      console.log(event.target.value)
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
