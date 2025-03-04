'use client'

import { Combobox } from '@/components/client/ui/combobox'

import { useState, useEffect } from 'react'
import {
  getNovaPoshtaAllCities,
  getNovaPoshtaBranchesByCity,
} from '@/server/delivery/get-nova-poshta'

interface NovaPoshtaCitiesProps {
  city: string
  brunch: string
  onCityChange: (city: string) => void
  onBrunchChange: (brunch: string) => void
}

export default function NovaPoshtaCities({
  city,
  brunch,
  onCityChange,
  onBrunchChange,
}: NovaPoshtaCitiesProps) {
  const [cities, setCities] = useState<string[]>([])
  const [selectedCity, setSelectedCity] = useState<string>(city)

  const [brunches, setBrunches] = useState<string[][]>([])
  const [selectedBrunch, setSelectedBrunch] = useState<string>(brunch)

  useEffect(() => {
    const fetchCities = async (): Promise<void> => {
      const fetchedCities: string[] = await getNovaPoshtaAllCities()

      setCities(fetchedCities)
    }

    const fetchBrunches = async (): Promise<void> => {
      const fetchedBrunche: string[][] =
        await getNovaPoshtaBranchesByCity(selectedCity)

      setBrunches(fetchedBrunche)
    }

    fetchCities()
    fetchBrunches()
  }, [selectedCity])

  const citiesToSelect = cities.map((city) => ({ value: city, label: city }))

  const brunchesToSelect = brunches[0]
    ? brunches[0].map((brunch) => ({
        value: brunch,
        label: brunch,
      }))
    : []

  const handleCitySelect = (city: string): void => {
    setSelectedCity(city)
    onCityChange(city)
  }

  const handleBrunchSelect = (brunch: string): void => {
    setSelectedBrunch(brunch)
    onBrunchChange(brunch)
  }

  return (
    <div>
      <Combobox
        elements={citiesToSelect}
        selectedValue={selectedCity}
        onSelect={handleCitySelect}
      />

      <Combobox
        elements={brunchesToSelect}
        selectedValue={selectedBrunch}
        onSelect={handleBrunchSelect}
      />
    </div>
  )
}
