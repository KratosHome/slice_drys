'use client'

import React, { useEffect, useRef } from 'react'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const QUILL_CONTAINER_ID = 'js-editor-container'

const QuillEditor = () => {
  useEffect(() => {
    const quill = new Quill(`#${QUILL_CONTAINER_ID}`, {
      theme: 'snow',
      placeholder: 'Add message',
    })
  }, [])

  return (
    <div>
      <div id={QUILL_CONTAINER_ID}></div>
    </div>
  )
}

export default QuillEditor
