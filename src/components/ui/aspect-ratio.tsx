import { type ComponentProps } from 'react'

function AspectRatio({
  ratio = 1,
  className,
  style,
  ...props
}: ComponentProps<'div'> & { ratio?: number }) {
  return (
    <div
      data-slot="aspect-ratio-wrapper"
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${100 / ratio}%`,
      }}
    >
      <div
        data-slot="aspect-ratio"
        className={className}
        {...props}
        style={{
          ...style,
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />
    </div>
  )
}
export { AspectRatio }
