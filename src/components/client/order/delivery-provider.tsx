'use client'

import { Combobox } from '@/components/client/ui/combobox'

import { useState, useEffect } from 'react'
import { getNPBranchesByCityRef } from '@/server/delivery/get-branches.server'
import { useCartStore } from '@/store/cartStore'
import { UseControllerProps } from 'react-hook-form'

interface NovaPoshtaCitiesProps {
  control: UseControllerProps['control']
  defaultCities: IDirectoryCity[]
  // getCity: (city: string) => Promise<INovaPoshtaApiResponse<{
  //   Addresses: INovaPoshtaApiCity[]
  // }> | null>
  // getBranches: (cityRef: string) => Promise<IDirectoryBranch[] | null>
  onCityChange: (city: { value: string; label: string }) => void
  onBranchChange: (branch: { value: string; label: string }) => void
}
type CityDataType<
  T extends
    | IDirectoryCity
    | Omit<IDirectoryBranch, 'branchType'>
    | { value: string; label: string },
> = T extends IDirectoryCity | Omit<IDirectoryBranch, 'branchType'>
  ? { value: string; label: string }
  : IDirectoryCity | Omit<IDirectoryBranch, 'branchType'>

export function transformToCombo<
  T extends
    | IDirectoryCity
    | Omit<IDirectoryBranch, 'branchType'>
    | { value: string; label: string },
>(data: T, type?: 'city' | 'branch'): CityDataType<T> {
  if ('ref' in data && 'city' in data) {
    return {
      value: data.ref,
      label: data.city,
    } as CityDataType<T>
  } else if ('branchRef' in data && 'branchName' in data) {
    return {
      value: data.branchRef,
      label: data.branchName,
    } as CityDataType<T>
  } else if ('value' in data && 'label' in data) {
    return type === 'city'
      ? ({
          ref: data.value,
          city: data.label,
        } as CityDataType<T>)
      : ({
          branchRef: data.value,
          branchName: data.label,
        } as CityDataType<T>)
  } else {
    console.error('Unsupported type provided to transformToCombo')
    return {} as CityDataType<T>
  }
}

export default function DeliveryProvider({
  control,
  defaultCities,
  // getCity,
  // getBranches,
  onCityChange,
  onBranchChange,
}: NovaPoshtaCitiesProps) {
  const deliveryInfo = useCartStore(
    (state) => state.cart.userData?.deliveryInfo,
  )

  const [cities, setCities] = useState(
    defaultCities.map((c) => transformToCombo(c)),
  )

  const [branches, setBranches] = useState<IDirectoryBranch[]>([])

  useEffect(() => {
    ;(async () => {
      if (!deliveryInfo?.city?.value) return
      const branches = await getNPBranchesByCityRef(deliveryInfo?.city?.value)
      if (branches) setBranches(branches)
    })()
  }, [])

  const handleCitySelect = async (city: { value: string; label: string }) => {
    onCityChange(city)

    const allBranches = await getNPBranchesByCityRef(city.value)
    if (allBranches) {
      setBranches(allBranches)
    }
  }

  const handleBranchSelect = (branch: {
    value: string
    label: string
  }): void => {
    onBranchChange(branch)
  }

  console.log('branches: ', branches)
  return (
    <div>
      <Combobox
        name="deliveryInfo.city"
        rules={{
          required: {
            value: true,
            message: 'Це поле є обов’язковим',
          },
          minLength: {
            value: 1,
            message: 'Це поле є обов’язковим',
          },
        }}
        value={deliveryInfo?.city?.label ?? ''}
        control={control}
        elements={cities}
        selectedValue={
          deliveryInfo?.city || {
            value: '',
            label: '',
          }
        }
        onSelect={handleCitySelect}
        placeholder="Вкажи населений пункт"
      />
      {deliveryInfo?.city?.label && (
        <Combobox
          name="deliveryInfo.branch"
          rules={{
            required: {
              value: true,
              message: 'Це поле є обов’язковим',
            },
            minLength: {
              value: 1,
              message: 'Це поле є обов’язковим',
            },
          }}
          value={deliveryInfo?.branch?.label}
          control={control}
          elements={branches
            .filter(
              (branch) =>
                branch.branchType.toLowerCase() ===
                deliveryInfo?.deliveryMethod,
            )
            .map((branch) => transformToCombo(branch, 'branch'))}
          selectedValue={
            deliveryInfo?.branch || {
              value: '',
              label: '',
            }
          }
          onSelect={handleBranchSelect}
          placeholder={`Вибери ${deliveryInfo?.deliveryMethod === 'branch' ? 'відділення' : 'поштомат'} `}
        />
      )}
    </div>
  )
}
