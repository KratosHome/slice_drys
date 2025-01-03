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
import QuillEditor from './quill-editor'
import 'quill/dist/quill.snow.css'
import { createPost } from '@/server/posts/create-post.server'

interface ICratePost {
  buttonTitle: string
  post: IPostLocal
}

const EditorPost: FC<ICratePost> = ({ buttonTitle, post }) => {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const editorRef = useRef<HTMLDivElement | null>(null)
  const [quillEditorContent, setQuillEditorContent] = useState<string>('')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<IPostLocal>({
    defaultValues: {
      title: { en: '', uk: '' },
      content: '',
    },
  })

  useEffect(() => {
    setValue('content', quillEditorContent)
  }, [quillEditorContent, setValue])

  const onSubmit = async (data: IPostLocal) => {
    console.log(data)
    createPost(data)
  }

  return (
    <div>
      {loading && <Loading />}
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
