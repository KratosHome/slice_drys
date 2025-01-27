import React, { useState, useEffect } from 'react'
import { getNovaPoshtaAllCities } from '@/server/delivery/get-nova-poshta'
import { ComboboxDemo } from '@/components/client/ui/combobox'

export default function NovaPoshtaCities() {
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')

  useEffect(() => {
    const fetchCities = async () => {
      const fetchedCities: string[] = await getNovaPoshtaAllCities()
      setCities(fetchedCities)
    }
    fetchCities()
  }, [])

  const citiesToSelect = cities.map((city) => ({ value: city, label: city }))

  console.log(selectedCity)

  return (
    <div>
      <ComboboxDemo
        elements={citiesToSelect}
        selectedValue={selectedCity}
        onSelect={setSelectedCity}
      />
    </div>
  )
}
