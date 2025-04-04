import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function Cart() {
  return (
    <div className="relative">
      <Button variant="icons">
        <Image src="/icons/bin.svg" width={32} height={32} alt="cart icon" />
      </Button>
    </div>
  )
}
