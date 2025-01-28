import React from 'react'
import Button from '@/components/client/ui/button'
import Image from 'next/image'

const Search = () => {
  return (
    <Button variant={'icons'}>
      <Image
        src={'/icons/search.svg'}
        alt="search"
        width={32}
        height={32}
        className="cursor-pointer"
      />
    </Button>
  )
}

export default Search
