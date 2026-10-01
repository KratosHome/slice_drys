'use client'

import type { ChangeEvent, InputHTMLAttributes } from 'react'

import { ErrorMessage } from '@hookform/error-message'

import {
  useController,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from 'react-hook-form'
import { cn } from '@/utils/cn'

type InputProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues,
> = {
  helpText?: string
} & UseControllerProps<TFieldValues, TName, TTransformedValues> &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue'>

function Input<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(props: InputProps<TFieldValues, TName, TTransformedValues>) {
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
    fieldState: { invalid },
    formState: { errors },
  } = useController({
    name,
    rules,
    control,
    shouldUnregister,
    defaultValue,
    disabled,
  })
  const errorId = `${props.id || name}-error`
  const helpId = `${props.id || name}-help`
  const describedBy =
    [
      props['aria-describedby'],
      invalid ? errorId : undefined,
      helpText ? helpId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <div>
      <input
        {...inputProps}
        {...field}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          field.onChange(event)
          if (props.onChange) props.onChange(event)
        }}
        placeholder={props.placeholder}
        type={props.type || 'text'}
        id={props.id}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={cn(
          'border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      />
      <div id={errorId} aria-live="polite">
        <ErrorMessage<FieldErrors>
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
      </div>

      {!!helpText ? (
        <p id={helpId} className="text-muted-foreground mt-1 text-base">
          {helpText}
        </p>
      ) : null}
    </div>
  )
}

export { Input }
