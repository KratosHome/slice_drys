'use client'
import React, { FC, useState, useEffect, useRef } from 'react'
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
import { Button } from '@/components/admin/ui/button'
import QuillEditor from './quill-editor'
import 'quill/dist/quill.snow.css'
import { createPost } from '@/server/posts/create-post.server'

interface ICratePost {
  buttonTitle: string
}

const EditorPost: FC<ICratePost> = ({ buttonTitle }) => {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const editorRef = useRef<HTMLDivElement | null>(null)
  const [quillEditorContent, setQuillEditorContent] = useState<string>('')

  const postData: IPostLocal = {
    title: 'Sample Post Title',

    content: 'This is the content of the sample post.',

    img: 'path/to/image.jpg',
    author: 'John Doe',

    date: new Date('2023-10-15'),
    slug: 'sample-post-title',
    metaDescription: 'A brief description of the sample post content.',
    keywords: ['sample', 'post', 'typescript'],
    readingTime: 5,
  }
  const result = createPost(postData)
  console.log(result)

  return (
    <div>
      {loading && <Loading />}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button>{buttonTitle}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Button variant="outline" onClick={() => createPost}>
              test
            </Button>
            <AlertDialogTitle>{buttonTitle} товар</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <QuillEditor content="" setContent={setQuillEditorContent} />
          </AlertDialogDescription>
          <AlertDialogFooter>
            <div>22</div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default EditorPost
