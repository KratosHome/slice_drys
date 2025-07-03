'use client'

import type { ChangeEvent, InputHTMLAttributes } from 'react'

import { ErrorMessage } from '@hookform/error-message'

import { useController, type UseControllerProps } from 'react-hook-form'
import { cn } from '@/utils/cn'

type InputProps = {
  helpText?: string
} & UseControllerProps &
  InputHTMLAttributes<HTMLInputElement>

function Input(props: InputProps) {
  const {
    name,
    rules,
    control,
    shouldUnregister,
    defaultValue,
    disabled,
    className,
    helpText,
    ...inputProps
  } = props

  const {
    field,
    formState: { errors },
  } = useController({
    name,
    rules,
    control,
    shouldUnregister,
    defaultValue,
    disabled,
  })

  return (
    <div>
      <input
        {...inputProps}
        {...field}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          if (props.onChange) props.onChange(event)
        }}
        placeholder={props.placeholder}
        type={props.type || 'text'}
        id={props.id}
        className={cn(
          'border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
      <ErrorMessage
        errors={errors}
        name={field.name}
        render={({ messages }) =>
          messages &&
          Object.entries(messages).map(([type, message]) => (
            <p key={type} className="mt-1 text-xs text-red-600">
              {message}
            </p>
          ))
        }
      />

      {!!helpText ? (
        <p className="text-muted-foreground mt-1 text-base">{helpText}</p>
      ) : null}
    </div>
  )
}

export { Input }
