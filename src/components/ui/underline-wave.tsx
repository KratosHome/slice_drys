interface IUnderlineWaveProps {
  className?: string
}

export default function UnderlineWave({ className }: IUnderlineWaveProps) {
  return (
    <svg className={`underline-wave ${className}`}>
      <use href="/icons/sprite.svg#underline" />
    </svg>
  )
}
