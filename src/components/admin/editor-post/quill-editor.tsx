'use client'
import React, { useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const QUILL_CONTAINER_ID = 'js-editor-container'

interface QuillEditorProps {
  content: string
  setContent: (content: string) => void
  className?: string
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  content,
  setContent,
  className,
}) => {
  const [toPreventDoubleQuill, setToPreventDoubleQuill] = useState(true)
  const quillRef = useRef<Quill | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  if (!content) {
    content = '{"ops":[{"insert":"\\n"}]}'
  }

  useEffect(() => {
    setToPreventDoubleQuill(!toPreventDoubleQuill)
    if (containerRef.current && !quillRef.current && toPreventDoubleQuill) {
      quillRef.current = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder: 'Add message',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }], // Розміри заголовків
            ['bold', 'italic', 'underline', 'strike'], // Стилі тексту
            [{ list: 'ordered' }, { list: 'bullet' }], // Списки
            ['link', 'image'], // Вставка лінків та зображень
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setContent])

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
    ></div>
  )
}

export default QuillEditor
