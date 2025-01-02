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
            <AlertDialogTitle>{buttonTitle} товар</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <QuillEditor />
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
