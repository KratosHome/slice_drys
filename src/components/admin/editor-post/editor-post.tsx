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
  const [isOpen, setIsOpen] = useState(false)
  const [postContent, setPostContent] = useState<ILocalizedString>(
    post?.content || {
      en: '{\"ops\":[{\"insert\":\"11"}]}',
      uk: '{\"ops\":[{\"insert\":\"22"}]}',
    },
  )
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
      title: { en: '', uk: '' },
      content: {
        en: '{\"ops\":[{\"insert\":\"1"}]}',
        uk: '{\"ops\":[{\"insert\":\"2"}]}',
      },
    },
  })

  useEffect(() => {
    setValue('content', postContent)
  }, [postContent, setValue])

  const onSubmit = async (data: IPostLocal) => {
    console.log(data)
    createPost(data)
  }

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target)
    if (event.target.value === 'en' && event.target.checked) {
      setPostContent({ ...postContent, uk: quillEditorContent })
      setQuillEditorContent(postContent.en)
      //
    } else if (event.target.value === 'uk' && event.target.checked) {
      setPostContent({ ...postContent, en: quillEditorContent })
      setQuillEditorContent(postContent.uk)
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
                      <Label>en</Label>
                      <RadioGroupItem value="en"> </RadioGroupItem>
                    </div>
                    <div className="flex gap-1">
                      <Label>uk</Label>
                      <RadioGroupItem value="uk"></RadioGroupItem>
                    </div>
                  </div>
                </RadioGroup>
                <QuillEditor
                  content={quillEditorContent}
                  setContent={setQuillEditorContent}
                />
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
