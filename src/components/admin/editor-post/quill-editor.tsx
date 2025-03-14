'use client'

import { useEffect, useRef, useState } from 'react'

import 'quill/dist/quill.snow.css'

const QUILL_CONTAINER_ID = 'js-editor-container'

interface IQuillEditorProps {
  content: string
  setContent: (content: string) => void
  className?: string
}

const QuillEditor = ({ content, setContent, className }: IQuillEditorProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Quill, setQuill] = useState<any>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const quillRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  if (!content) content = '{"ops":[{"insert":"\\n"}]}'

  useEffect(() => {
    const timerId = setTimeout(async () => {
      const Quill = (await import('quill')).default

      setQuill(Quill)
    }, 3000)

    return () => clearTimeout(timerId)
  }, [])

  useEffect(() => {
    if (Quill && containerRef.current && !quillRef.current) {
      quillRef.current = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder: 'Add message',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            [{ align: [] }],
          ],
        },
      })

      quillRef.current.on('text-change', () => {
        const currentContent = JSON.stringify(quillRef.current!.getContents())
        setContent(currentContent)
      })
    }

    return () => {
      quillRef.current?.off('text-change')
      quillRef.current = null
    }
  }, [setContent, Quill])

  useEffect(() => {
    if (
      quillRef.current &&
      content !== JSON.stringify(quillRef.current.getContents())
    ) {
      const range = quillRef.current.getSelection()

      quillRef.current.setContents(JSON.parse(content))

      if (range) {
        setTimeout(() => {
          quillRef.current?.setSelection(range)
        }, 0)
      }
    }
  }, [content])

  return (
    <div
      className={className || ''}
      id={QUILL_CONTAINER_ID}
      ref={containerRef}
    />
  )
}

export default QuillEditor
