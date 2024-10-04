import { IPropsButton } from '../interfaces/Interfaces'
import React, { FC } from 'react'

export const Button: FC<IPropsButton> = ({ className, label, onClick }) => {
  return (
    <button className={className} onClick={onClick}>
      {label}
    </button>
  )
}
