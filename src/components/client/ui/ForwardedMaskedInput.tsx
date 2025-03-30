import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  Suspense,
  lazy,
} from 'react'
import type { MaskedInputProps } from 'react-text-mask'

const LazyMaskedInput = lazy(() =>
  import('react-text-mask').then((module) => ({
    default: module.default as React.ComponentType<MaskedInputProps>,
  })),
)

const ForwardedMaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  (props, ref) => {
    const maskedInputRef = useRef<any>(null)

    useImperativeHandle(
      ref,
      () => maskedInputRef.current?.inputElement as HTMLInputElement,
    )

    return (
      <Suspense fallback={<input {...props} />}>
        <LazyMaskedInput {...props} ref={maskedInputRef} />
      </Suspense>
    )
  },
)

ForwardedMaskedInput.displayName = 'ForwardedMaskedInput'

export default ForwardedMaskedInput
