import React from 'react'

type Props = { className?: string }

function UnderlineWave({ className }: Props) {
  return (
    <svg className={`underline-wave ${className}`}>
      <use href="/icons/sprite.svg#underline" />
    </svg>
  )
}

export default UnderlineWave
