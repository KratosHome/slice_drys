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

  useEffect(() => {
    quillRef.current = new Quill(`#${QUILL_CONTAINER_ID}`, {
      theme: 'snow',
      placeholder: 'Add message',
    })
    if (content) quillRef.current.setContents(JSON.parse(content))

    quillRef.current.on('text-change', () => {
      const currentContent = JSON.stringify(quillRef.current!.getContents())
      setContent(currentContent) // Update parent state
    })

    return () => {
      quillRef.current?.off('text-change')
      quillRef.current = null
    }
  }, [content, setContent])

  return <div id={QUILL_CONTAINER_ID}></div>
}

export default QuillEditor
