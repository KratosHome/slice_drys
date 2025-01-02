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
import Quill from 'quill'
import QuillEditor from './quill-editor'
import 'quill/dist/quill.snow.css'

interface ICratePost {
  buttonTitle: string
}

const EditorPost: FC<ICratePost> = ({ buttonTitle }) => {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const editorRef = useRef<HTMLDivElement | null>(null)
  const [quillEditorContent, setQuillEditorContent] = useState<string>('')

  useEffect(() => {
    if (editorRef.current) {
      new Quill(editorRef.current, {
        theme: 'snow', // Specify theme in options
      })
    }
  }, [editorRef])

  return (
    <div>
      {loading && <Loading />}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button>{buttonTitle}</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <Button
              variant="outline"
              onClick={() => console.log(quillEditorContent)}
            >
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
