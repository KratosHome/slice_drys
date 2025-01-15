'use client'
import React, { useEffect, useRef } from 'react'
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
  const quillRef = useRef<Quill | null>(null)
  const toPreventDoubleQuillRef = useRef(true)
  const containerRef = useRef<HTMLDivElement | null>(null)
  if (!content) {
    content = '{"ops":[{"insert":"\\n"}]}'
  }
  useEffect(() => {
    if (
      containerRef.current &&
      !quillRef.current &&
      toPreventDoubleQuillRef.current
    ) {
      toPreventDoubleQuillRef.current = false
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
