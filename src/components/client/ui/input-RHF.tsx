import * as React from 'react'
import { useController, UseControllerProps } from 'react-hook-form'

import { ErrorMessage } from '@hookform/error-message'
import { cn } from '@/utils/cn'

type InputProps = {
  helpText?: string
} & UseControllerProps &
  React.InputHTMLAttributes<HTMLInputElement>

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
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          if (props.onChange) {
            props.onChange(event)
          }
        }}
        placeholder={props.placeholder}
        type={props.type || 'text'}
        id={props.id}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
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

      {!!helpText && (
        <p className="mt-1 text-base text-muted-foreground">{helpText}</p>
      )}
    </div>
  )
}

export { Input }
