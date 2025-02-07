import { cn } from '@/utils/cn'
import Image from 'next/image'

const Arcs = ({ color }: { color: string }) => (
  <>
    <svg width="100%" height="100%" viewBox="0 0 1106 553" fill="none">
      <path
        id="arcPath"
        d="M1105 553C1105 406.601 1046.84 266.197 943.323 162.677C839.803 59.157 699.4 1.00001 553 1C406.601 0.999989 266.197 59.157 162.677 162.677C59.157 266.197 1.00002 406.6 1 553"
        stroke="url(#paint0_linear_158_1319)"
      />

      <defs>
        <linearGradient
          id="paint0_linear_158_1319"
          x1="1078.5"
          y1="527"
          x2="116"
          y2="229.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#9B9B9B" stopOpacity="0.1" />
          <stop offset="0.961123" stopColor={color} />
        </linearGradient>
      </defs>
    </svg>

    <Image
      src="/icons/slider-line-down.svg"
      className={cn('-z-20 mt-[16px] px-[32px] md:mt-[33px] md:px-[62px]')}
      fill={true}
      alt="slider"
    />
  </>
)

export default Arcs
