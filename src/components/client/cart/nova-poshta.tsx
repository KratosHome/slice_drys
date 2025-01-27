import React, { useState, useEffect } from 'react'
import {
  getNovaPoshtaAllCities,
  getNovaPoshtaBranchesByCity,
} from '@/server/delivery/get-nova-poshta'
import { Combobox } from '@/components/client/ui/combobox'

export default function NovaPoshtaCities() {
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')

  useEffect(() => {
    getNovaPoshtaBranchesByCity('Київ')
    const fetchCities = async () => {
      const fetchedCities: string[] = await getNovaPoshtaAllCities()
      setCities(fetchedCities)
    }
    fetchCities()
  }, [])

  const citiesToSelect = cities.map((city) => ({ value: city, label: city }))

  return (
    <div>
      <Combobox
        elements={citiesToSelect}
        selectedValue={selectedCity}
        onSelect={setSelectedCity}
      />
    </div>
  )
}
