'use client'

import React, { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const QuillEditor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (editorRef.current) {
      new Quill(editorRef.current, {
        theme: 'snow',
      })
    }
  }, [])

  return (
    <div>
      <div ref={editorRef}></div>
    </div>
  )
}

export default QuillEditor
