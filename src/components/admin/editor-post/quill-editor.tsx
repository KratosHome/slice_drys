'use client'

import React, { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const QUILL_CONTAINER_ID = 'js-editor-container'

interface QuillEditorProps {
  content: string
}

const QuillEditor: React.FC<QuillEditorProps> = ({ content }) => {
  const contentRef = useRef<string>(content)
  const quillRef = useRef<Quill | null>(null)

  useEffect(() => {
    quillRef.current = new Quill(`#${QUILL_CONTAINER_ID}`, {
      theme: 'snow',
      placeholder: 'Add message',
    })

    quillRef.current.setContents(JSON.parse(contentRef.current))

    quillRef.current.on('text-change', () => {
      contentRef.current = JSON.stringify(quillRef.current!.getContents())
    })

    return () => {
      quillRef.current?.off('text-change')
      quillRef.current = null
    }
  }, [])

  return (
    <div>
      <div id={QUILL_CONTAINER_ID}></div>
    </div>
  )
}

export default QuillEditor
