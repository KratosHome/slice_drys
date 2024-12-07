import { cn } from '@/utils/cn'
import { sliders } from './consts'

const SliderItem = ({
  item,
  index,
  hoveredIndex,
}: {
  index: number
  item: { name: string }
  hoveredIndex: number
}) => {
  const hoverColor = sliders[hoveredIndex].color

  const Text = () => (
    <div
      className={cn(
        'z-20 -translate-y-4 text-[36px] font-semibold sm:-translate-y-8 md:-translate-y-10',
        hoveredIndex === index && 'font-bold',
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
            hoveredIndex === index
              ? 'text-[2.3rem]'
              : 'fill-mid_gray text-[1.75rem]',
          )}
          fontFamily="Arial"
          letterSpacing="5"
          fill={hoveredIndex === index ? hoverColor : 'black'}
        >
          <textPath href="#curve" startOffset="50%" textAnchor="middle">
            {item.name}
          </textPath>
        </text>
      </svg>
    </div>
  )

  const Bullet = () => (
    <div
      className={cn(
        'absolute mt-5 size-1 bg-black sm:size-2',
        hoveredIndex === index && 'size-2 sm:size-5',
      )}
      style={hoveredIndex === index ? { background: hoverColor } : {}}
    />
  )

  const Blur = () => (
    <div
      style={{ background: hoverColor }}
      className={cn(
        `absolute aspect-[1/1] w-[5rem] rounded opacity-0 md:w-[10rem]`,
        hoveredIndex === index && 'opacity-30 blur-xl md:blur-3xl',
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
