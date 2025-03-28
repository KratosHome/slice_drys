'use client'

import { Combobox, transformToCombo } from '@/components/client/ui/combobox'
import { useCartStore } from '@/store/cartStore'
import { useTranslations } from 'next-intl'
import { UseControllerProps } from 'react-hook-form'

interface DeliveryProviderProps {
  control: UseControllerProps['control']
  onCityChange: (city: IComboboxData) => void
  onBranchChange: (branch: IComboboxData) => void
  defaultValues?: IDirectoryCity[]
}

export default function DeliveryProvider({
  control,
  onCityChange,
  defaultValues,
  onBranchChange,
}: DeliveryProviderProps) {
  const t = useTranslations('order')
  const deliveryInfo = useCartStore(
    (state) => state.cart.userData?.deliveryInfo,
  )

  const handleCitySelect = async (city: IComboboxData) => {
    onCityChange(city)
  }

  const handleBranchSelect = (branch: IComboboxData) => {
    onBranchChange(branch)
  }

  return (
    <>
      <Combobox
        name="deliveryInfo.city"
        rules={{
          required: {
            value: true,
            message: t('validation_required'),
          },
        }}
        defaultValues={defaultValues?.map((city) =>
          transformToCombo<IDirectoryCity>(city),
        )}
        control={control}
        onSelect={handleCitySelect}
        placeholder={t('city_placeholder')}
      />
      {deliveryInfo?.city?.label && (
        <Combobox
          name="deliveryInfo.branch"
          rules={{
            required: {
              value: true,
              message: t('validation_required'),
            },
          }}
          control={control}
          onSelect={handleBranchSelect}
          placeholder={t('branch_placeholder', {
            type: deliveryInfo?.deliveryMethod,
          })}
        />
      )}
    </>
  )
}
