import { cn } from '@/utils/cn'

interface IArcsProps {
  color: string
}

export default function Arcs({ color }: IArcsProps) {
  return (
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
      <svg
        viewBox="0 0 981 491"
        fill="none"
        aria-hidden="true"
        focusable="false"
        className={cn(
          'absolute inset-0 -z-20 mt-[16px] h-full w-full px-[32px] md:mt-[33px] md:px-[62px]',
        )}
      >
        <path
          d="M1 490.5C1.00001 426.218 13.6613 362.565 38.261 303.176C62.8607 243.788 98.917 189.825 144.371 144.371C189.826 98.9169 243.788 62.8606 303.177 38.2609C362.565 13.6613 426.218 0.999992 490.5 1C554.782 1.00001 618.435 13.6613 677.824 38.261C737.212 62.8607 791.175 98.917 836.629 144.371C882.083 189.826 918.139 243.788 942.739 303.177C967.339 362.565 980 426.218 980 490.5"
          stroke="url(#slider-line-down-gradient)"
        />
        <defs>
          <linearGradient
            id="slider-line-down-gradient"
            x1="264"
            y1="947"
            x2="464.5"
            y2="23.4999"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#9B9B9B" stopOpacity="0.1" />
            <stop offset="0.961123" stopColor="#535353" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </svg>
    </>
  )
}
