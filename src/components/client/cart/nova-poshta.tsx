import React, { useState, useEffect } from 'react'
import { getNovaPoshtaAllCities } from '@/server/delivery/get-nova-poshta'

export default function NovaPoshtaCities() {
  const [cities, setCities] = useState<string[]>([])
  useEffect(() => {
    const fetchCities = async () => {
      const fetchedCities: string[] = await getNovaPoshtaAllCities()
      setCities(fetchedCities)
    }
    fetchCities()
  }, [])

  return <div>{cities[0]}</div>
}
