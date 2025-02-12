import Image from 'next/image'
import Button from '@/components/client/ui/button'

export default function Cart() {
  return (
    <div className="relative">
      <Button variant={'icons'}>
        <Image src={'/icons/bin.svg'} width={32} height={32} alt="cart icon" />
      </Button>
      <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red text-xs text-white">
        1
      </span>
    </div>
  )
}
