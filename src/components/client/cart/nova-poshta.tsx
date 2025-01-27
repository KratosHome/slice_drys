import React, { useState, useEffect } from 'react'
import {
  getNovaPoshtaAllCities,
  getNovaPoshtaBranchesByCity,
} from '@/server/delivery/get-nova-poshta'
import { Combobox } from '@/components/client/ui/combobox'

export default function NovaPoshtaCities() {
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [brunches, setBrunches] = useState<string[][]>([])

  const [selectedBrunch, setSelectedBrunch] = useState<string>('')

  useEffect(() => {
    const fetchCities = async () => {
      const fetchedCities: string[] = await getNovaPoshtaAllCities()
      setCities(fetchedCities)
    }

    const fetchBrunches = async () => {
      const fetchedBrunche: string[] =
        await getNovaPoshtaBranchesByCity(selectedCity)
      setBrunches(fetchedBrunche)
    }

    fetchCities()

    fetchBrunches()
  }, [selectedCity])

  const citiesToSelect = cities.map((city) => ({ value: city, label: city }))
  console.log(111, cities)
  console.log(222, brunches)
  const brunchesToSelect = brunches[0]
    ? brunches[0].map((brunch) => ({
        value: brunch,
        label: brunch,
      }))
    : []

  return (
    <div>
      <Combobox
        elements={citiesToSelect}
        selectedValue={selectedCity}
        onSelect={setSelectedCity}
      />
      <Combobox
        elements={brunchesToSelect}
        selectedValue={selectedBrunch}
        onSelect={setSelectedBrunch}
      />
    </div>
  )
}
