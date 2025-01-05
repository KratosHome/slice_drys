'use client'
import React, { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const QUILL_CONTAINER_ID = 'js-editor-container'

interface QuillEditorProps {
  content: string
  setContent: (content: string) => void
}

const QuillEditor: React.FC<QuillEditorProps> = ({ content, setContent }) => {
  const quillRef = useRef<Quill | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      quillRef.current = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder: 'Add message',
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
      content &&
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

  return <div id={QUILL_CONTAINER_ID} ref={containerRef}></div>
}

export default QuillEditor
