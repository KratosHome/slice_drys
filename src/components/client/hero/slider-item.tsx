import { cn } from '@/utils/cn'

const SliderItem = ({
  title,
  hoverHexColor,
  isHovered,
}: {
  title: string
  hoverHexColor: string
  isHovered: boolean
}) => {
  const Text = () => (
    <div
      className={cn(
        'z-20 -translate-y-4 text-[36px] font-semibold sm:-translate-y-8 md:-translate-y-10',
        isHovered && 'font-bold',
      )}
    >
      <svg
        viewBox="100 85 190 50"
        height="70"
        className="w-[80px] sm:w-[100px] md:w-[150px]"
      >
        <path
          stroke="transparent"
          fill="transparent"
          d="M 120,150 A 190,100 0 0,1 270,150"
          id="curve"
        />

        <text
          className={cn(
            isHovered ? 'text-[2.3rem]' : 'fill-mid_gray text-[1.75rem]',
          )}
          fontFamily="Arial"
          letterSpacing="5"
          fill={isHovered ? hoverHexColor : 'black'}
        >
          <textPath href="#curve" startOffset="50%" textAnchor="middle">
            {title}
          </textPath>
        </text>
      </svg>
    </div>
  )

  const Bullet = () => (
    <div
      className={cn(
        'absolute mt-5 size-1 bg-black sm:size-2',
        isHovered && 'size-2 sm:size-5',
      )}
      style={isHovered ? { background: hoverHexColor } : {}}
    />
  )

  const Blur = () => (
    <div
      style={{ background: hoverHexColor }}
      className={cn(
        `absolute aspect-[1/1] w-[5rem] rounded opacity-0 md:w-[10rem]`,
        isHovered && 'opacity-30 blur-xl md:blur-3xl',
      )}
    />
  )

  return (
    <>
      <Text />
      <Bullet />
      <Blur />
    </>
  )
}

export default SliderItem
