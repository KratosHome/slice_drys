import React from 'react'
import { useController, UseControllerProps } from 'react-hook-form'
import { Textarea as BaseTextarea } from '@/components/ui/textarea'

import { ErrorMessage } from '@hookform/error-message'
import { cn } from '@/utils/cn'

type TextAreaProps = {
  helpText?: string
} & UseControllerProps &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>

function Textarea(props: TextAreaProps) {
  const {
    name,
    rules,
    control,
    shouldUnregister,
    defaultValue,
    disabled,
    className,
    helpText,
    ...textAreaProps
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
      <BaseTextarea
        className={cn(
          'mt-8 resize-none border border-gray-300 text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)]',
          className,
        )}
        placeholder={props.placeholder}
        id={props.id}
        rows={5}
        {...textAreaProps}
        {...field}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
          if (props.onChange) {
            props.onChange(event)
          }
        }}
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
        <p className="text-muted-foreground mt-1 text-base">{helpText}</p>
      )}
    </div>
  )
}

export default Textarea
