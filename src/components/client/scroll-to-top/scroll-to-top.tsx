'use client'
import React, { useEffect } from 'react'

const ScrollToTop: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return null
}

export default ScrollToTop
