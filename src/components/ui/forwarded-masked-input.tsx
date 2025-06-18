'use client'

import { forwardRef, useImperativeHandle, useRef } from 'react'
import MaskedInput, { type MaskedInputProps } from 'react-text-mask'

const ForwardedMaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  (props, ref) => {
    const maskedInputRef = useRef<MaskedInput>(null)

    useImperativeHandle(ref, () => {
      return maskedInputRef.current?.inputElement as HTMLInputElement
    })

    return <MaskedInput {...props} ref={maskedInputRef} />
  },
)

ForwardedMaskedInput.displayName = 'ForwardedMaskedInput'

export default ForwardedMaskedInput
