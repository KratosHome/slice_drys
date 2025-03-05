'use client'

import NovaPoshtaCities from './nova-poshta'
import { RadioGroup, RadioGroupItem } from '@/components/client/ui/radio-group'

import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  type ChangeEvent,
} from 'react'
import { useForm } from 'react-hook-form'
import { useCartStore } from '@/store/cartStore'

interface CartFormRef {
  submit: () => void
}

const CartForm = forwardRef<CartFormRef>((_, ref) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IUserData>()

  const setUserData = useCartStore((state) => state.setCartUserData)
  const userData = useCartStore((state) => state.cart.userData)

  useEffect(() => {
    if (userData) {
      setValue('name', userData.name)
      setValue('surname', userData.surname)
      setValue('phoneNumber', userData.phoneNumber)
      setValue('email', userData.email)
      setValue('deliveryInfo.city', userData.deliveryInfo?.city || '')
      setValue('deliveryInfo.brunch', userData.deliveryInfo?.brunch || '')
      setValue(
        'deliveryInfo.deliveryMethod',
        userData.deliveryInfo?.deliveryMethod || 'novaPoshta',
      )
      setValue(
        'deliveryInfo.courierInfo',
        userData.deliveryInfo?.courierInfo || '',
      )
      setValue('paymentInfo', userData.paymentInfo)
      setValue('comment', userData.comment)
      setValue('acceptTerms', userData.acceptTerms)
      setValue('noCall', userData.noCall)
    }
  }, [userData, setValue])

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.checked) {
      setValue('deliveryInfo.deliveryMethod', event.target.value || '')

      const partialData: IUserData = {
        ...userData,
        deliveryInfo: {
          ...userData?.deliveryInfo,
          deliveryMethod: event.target.value,
        },
      }

      setUserData(partialData)
    }
  }

  const onSubmit = (data: IUserData): void => {
    const partialData: IUserData = {
      ...data,
      formStep:
        userData?.formStep && userData.formStep !== null
          ? userData.formStep < 4
            ? userData.formStep + 1
            : userData.formStep
          : 1,
    }

    setUserData(partialData)
  }

  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <input
          className="mt-5 border border-gray-300"
          placeholder="Призвище"
          id="surname"
          {...register('surname', { required: true })}
        />

        {errors.surname && <span>This field is required</span>}
      </div>

      <div>
        <input
          className="mt-5 border border-gray-300"
          placeholder="Імʼя"
          id="name"
          {...register('name', { required: true })}
        />

        {errors.name && <span>This field is required</span>}
      </div>

      <div>
        <input
          className="mt-5 border border-gray-300"
          placeholder="Телефон"
          id="phoneNumber"
          type="text"
          maxLength={17}
          {...register('phoneNumber', {
            minLength: {
              value: 17,
              message: 'не вірна довжина номера',
            },
            maxLength: {
              value: 17,
              message: 'не вірна довжина номера',
            },
            required: 'Це поле є обов’язковим',
          })}
          onClick={(event) => {
            const target = event.target as HTMLInputElement

            target.value = target.value == '' ? '+38 (0' : target.value
          }}
          onInput={(event) => {
            const target = event.target as HTMLInputElement

            target.value =
              '+38 (0' +
              target.value.replace(/\D/g, '').substring(3, 5) +
              (target.value.length > 7 ? ') ' : '') +
              (target.value.length > 9
                ? target.value.replace(/\D/g, '').substring(5)
                : '')
          }}
        />

        {errors.phoneNumber && <span>{errors.phoneNumber?.message}</span>}
      </div>

      <div>У форматі +38(093) 123 45 67</div>

      <div>
        <input
          className="mt-5 border border-gray-300"
          placeholder="E-mail"
          id="email"
          {...register('email', {
            required: 'Це поле є обов’язковим',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Некоректний формат електронної пошти',
            },
          })}
        />

        {errors.email && <span>{errors.email.message}</span>}
      </div>

      {userData?.formStep && userData.formStep >= 1 && (
        <RadioGroup
          onChange={handleRadioChange}
          defaultValue={userData?.deliveryInfo?.deliveryMethod || 'novaPoshta'}
        >
          Оберіть відділення нової пошти
          <div>
            <RadioGroupItem value="novaPoshta" id="r1" />
            Нова пошта
            <RadioGroupItem value="Courier" id="r2" />
            Курʼєр
            {userData?.deliveryInfo?.deliveryMethod == 'novaPoshta' ||
            !userData?.deliveryInfo?.deliveryMethod ? (
              <div>
                <NovaPoshtaCities
                  city={userData?.deliveryInfo?.city || ''}
                  brunch={userData?.deliveryInfo?.brunch || ''}
                  onCityChange={(newCity) =>
                    setValue('deliveryInfo.city', newCity)
                  }
                  onBrunchChange={(newBrunch) =>
                    setValue('deliveryInfo.brunch', newBrunch)
                  }
                  {...register('deliveryInfo.brunch', { required: true })}
                />

                {errors.deliveryInfo && <span>This field is required</span>}
              </div>
            ) : (
              <div>
                Поле courierInfo
                <input
                  className="mt-5 border border-gray-300"
                  placeholder="Payment Details Object"
                  id="courierInfo"
                  {...register('deliveryInfo.courierInfo', { required: true })}
                />
                {errors.deliveryInfo && <span>This field is required</span>}
              </div>
            )}
          </div>
        </RadioGroup>
      )}

      {userData?.formStep && userData.formStep >= 2 && (
        <div>
          <input
            className="mt-5 border border-gray-300"
            placeholder="Payment Details Object"
            id="paymentInfo"
            {...register('paymentInfo', { required: true })}
          />

          {errors.paymentInfo && <span>This field is required</span>}
        </div>
      )}

      {userData?.formStep && userData.formStep >= 3 && (
        <div>
          <input
            className="mt-5 border border-gray-300"
            placeholder="comment"
            id="comment"
            {...register('comment', { required: true })}
          />

          {errors.comment && <span>This field is required</span>}
        </div>
      )}

      {userData?.formStep && userData.formStep >= 4 && (
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              {...register('acceptTerms', { required: true })}
              id="acceptTerms"
              className={`form-check-input ${errors.acceptTerms ? 'is-invalid' : ''}`}
            />

            <span>Я погоджуюсь з умовами використання</span>
          </label>

          {errors.acceptTerms && <span>This field is required</span>}

          <label className="flex items-center space-x-3">
            <input type="checkbox" {...register('noCall')} id="doNotCall" />

            <span>Не телефонувати</span>
          </label>
        </div>
      )}

      {(!userData || (userData?.formStep ?? 0) <= 3) && (
        <button type="submit" className="bg-black px-5 py-2 text-white">
          Продовжити
        </button>
      )}
    </form>
  )
})

CartForm.displayName = 'CartForm'

export default CartForm
