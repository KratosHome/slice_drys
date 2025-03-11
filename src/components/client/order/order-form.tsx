'use client'

import DeliveryProvider from './delivery-provider'
import { RadioGroup, RadioGroupItem } from '@/components/client/ui/radio-group'

import { useEffect, forwardRef, useImperativeHandle, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useCartStore } from '@/store/cartStore'
import { Input } from '@/components/client/ui/input'
import { cn } from '@/utils/cn'
import { Label } from '@/components/admin/ui/label'
import { Textarea } from '@/components/admin/ui/textarea'
import { ErrorMessage } from '@hookform/error-message'

interface OrderFormRef {
  submit: () => void
}
type Props = {
  defaultCities: {
    novaPoshta: IDirectoryCity[]
  }
}
const fieldsetStyle = 'text-xl font-bold md:text-2xl'

const OrderForm = forwardRef<OrderFormRef, Props>(({ defaultCities }, ref) => {
  const setUserData = useCartStore((state) => state.setCartUserData)
  const userData = useCartStore((state) => state.cart.userData)

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    unregister,
    formState: { errors },
    clearErrors,
  } = useForm<
    IUserData<IDeliveryInfo<'branch' | 'postomat' | 'courier', string>>
  >({
    criteriaMode: 'all',
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })
  useEffect(() => {
    if (userData) {
      setValue('name', userData.name)
      setValue('surname', userData.surname)
      setValue('phoneNumber', userData.phoneNumber)
      setValue('email', userData.email)
      setValue('deliveryInfo.city', userData.deliveryInfo?.city?.label)

      setValue('deliveryInfo.branch', userData.deliveryInfo?.branch?.label)
      setValue(
        'deliveryInfo.deliveryProvider',
        userData.deliveryInfo?.deliveryProvider,
      )
      setValue(
        'deliveryInfo.deliveryMethod',
        userData.deliveryInfo?.deliveryMethod,
      )
      setValue('deliveryInfo.courierInfo', userData.deliveryInfo?.courierInfo)
      setValue('paymentInfo', userData.paymentInfo)
      setValue('comment', userData.comment)
      setValue('acceptTerms', userData.acceptTerms)
      setValue('noCall', userData.noCall)
      console.log('setValue')
    }
  }, [userData, setValue])

  const handleDeliveryProviderChange = (value: string): void => {
    setValue('deliveryInfo.deliveryProvider', value)
    setValue('deliveryInfo.city', '')
    unregister(['deliveryInfo.branch', 'deliveryInfo.courierInfo'])

    const partialData: IUserData<
      IDeliveryInfo<
        'branch' | 'postomat' | 'courier',
        {
          value: string
          label: string
        }
      >
    > = {
      ...userData,
      deliveryInfo: {
        // ...userData?.deliveryInfo,
        deliveryProvider: value,
        deliveryMethod: 'branch',
        // city: {
        //   value: '',
        //   label: '',
        // },
        // branch: {
        //   value: '',
        //   label: '',
        // },
      },
    }

    setUserData(partialData)
  }

  const handleDeliveryMethodChange = (value: IDeliveryMethods): void => {
    if (value === 'courier') {
      unregister(['deliveryInfo.branch', 'deliveryInfo.city'])
    }

    setValue('deliveryInfo.deliveryMethod', value, {
      shouldValidate: true,
    })

    if (value === 'branch' || value === 'postomat') {
      setValue('deliveryInfo.branch', '')
      unregister('deliveryInfo.courierInfo')
      clearErrors('deliveryInfo.branch')
    }

    alert('unregistered form data: \n' + JSON.stringify(getValues(), null, 2))
    const partialData: IUserData<
      IDeliveryInfo<
        'branch' | 'postomat' | 'courier',
        {
          value: string
          label: string
        }
      >
    > = {
      ...userData,
      deliveryInfo: {
        ...userData?.deliveryInfo,
        branch: {
          value: '',
          label: '',
        },
        deliveryMethod: value,
      },
    }
    setUserData(partialData)
    // alert('form data: \n' + JSON.stringify(getValues(), null, 2))
  }
  const handlePaymentMethodChange = (value: string): void => {
    setValue('paymentInfo', value)

    const partialData: IUserData<
      IDeliveryInfo<
        'branch' | 'postomat' | 'courier',
        {
          value: string
          label: string
        }
      >
    > = {
      ...userData,
      paymentInfo: value,
    }
    setUserData(partialData)
  }

  const onSubmit = (
    data: IUserData<IDeliveryInfo<'branch' | 'postomat' | 'courier', string>>,
  ): void => {
    // alert('form data: \n' + userData?.formStep + JSON.stringify(data, null, 2))
    alert('form data: \n' + JSON.stringify(getValues(), null, 2))
    if (!userData?.formStep || userData.formStep < 4) {
      const deliveryInfo: IDeliveryInfo<
        'branch' | 'postomat' | 'courier',
        {
          value: string
          label: string
        }
      > = {
        deliveryProvider: data.deliveryInfo?.deliveryProvider,
        deliveryMethod: data.deliveryInfo?.deliveryMethod,
      }
      if (data.deliveryInfo?.branch)
        deliveryInfo.branch = userData?.deliveryInfo?.branch
      if (data.deliveryInfo?.city)
        deliveryInfo.city = userData?.deliveryInfo?.city
      if (data.deliveryInfo?.courierInfo)
        deliveryInfo.courierInfo = data.deliveryInfo?.courierInfo

      const partialData: IUserData<
        IDeliveryInfo<
          'branch' | 'postomat' | 'courier',
          {
            value: string
            label: string
          }
        >
      > = {
        ...data,
        deliveryInfo,
        formStep:
          userData?.formStep && userData.formStep !== null
            ? userData.formStep + 1
            : 1,
      }
      setUserData(partialData)
    }
  }

  useImperativeHandle(ref, () => ({
    submit: handleSubmit(onSubmit),
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col">
      <fieldset>
        <legend className={cn(fieldsetStyle, 'mt-8')}>Контактні дані</legend>
        <Input
          placeholder="Прізвище"
          name="surname"
          id="surname"
          control={control}
          // defaultValue={userData?.surname ?? ''}
          rules={{
            required: {
              value: true,
              message: 'Це поле є обов’язковим',
            },
          }}
          className="mt-8 h-[60px] max-w-[90%] px-4 py-[18px] text-base md:py-[15px] md:text-xl"
        />

        <Input
          placeholder="Імʼя"
          name="name"
          id="name"
          control={control}
          // defaultValue={userData?.name ?? ''}
          rules={{
            required: {
              value: true,
              message: 'Це поле є обов’язковим',
            },
          }}
          className="mt-6 h-[60px] max-w-[90%] px-4 py-[18px] text-base md:py-[15px] md:text-xl"
        />

        <Input
          placeholder="Телефон"
          name="phoneNumber"
          id="phoneNumber"
          control={control}
          // defaultValue={userData?.phoneNumber ?? ''}
          helpText="У форматі +38 (093) 123 45 67"
          rules={{
            required: {
              value: true,
              message: 'Це поле є обов’язковим',
            },
            minLength: {
              value: 19,
              message: 'не вірна довжина номера',
            },
          }}
          onClick={(event) => {
            const target = event.target as HTMLInputElement

            setValue(
              'phoneNumber',
              (target.value = target.value == '' ? '+38 (0' : target.value),
            )
          }}
          onChange={(event) => {
            const target = (event.target as HTMLInputElement).value.replace(
              /\D/g,
              '',
            )
            const phoneNumber =
              '+38 (0' +
              target.substring(3, 5) +
              (target.length > 5 ? ') ' : '') +
              target.substring(5, 8) +
              (target.length > 8 ? ' ' : '') +
              target.substring(8, 10) +
              (target.length > 10 ? ' ' : '') +
              target.substring(10, 12)
            setValue('phoneNumber', phoneNumber)
            clearErrors('phoneNumber')
            setUserData({
              ...useCartStore.getState().cart.userData,
              phoneNumber,
            })
          }}
          className="mt-6 h-[60px] max-w-[90%] px-4 py-[18px] text-base md:py-[15px] md:text-xl"
        />

        <Input
          placeholder="E-mail"
          name="email"
          id="email"
          control={control}
          // defaultValue={userData?.email ?? ''}
          rules={{
            required: {
              value: true,
              message: 'Це поле є обов’язковим',
            },
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Некоректний формат електронної пошти',
            },
          }}
          className="mt-6 h-[60px] max-w-[90%] px-4 py-[18px] text-base md:py-[15px] md:text-xl"
        />
      </fieldset>

      {!userData?.formStep ||
        (userData.formStep >= 1 && (
          <fieldset className="mt-10 md:mt-[50px]">
            <legend className={fieldsetStyle}>Доставка</legend>

            <RadioGroup
              onValueChange={handleDeliveryProviderChange}
              value={userData?.deliveryInfo?.deliveryProvider}
            >
              <div>
                <div className="mt-8 flex items-center space-x-2 md:mt-[42px]">
                  <RadioGroupItem value="novaPoshta" id="NP" />
                  <Label
                    htmlFor="NP"
                    className="cursor-pointer select-none text-xl font-semibold"
                  >
                    Нова Пошта
                  </Label>
                </div>
                {userData?.deliveryInfo?.deliveryProvider == 'novaPoshta' && (
                  <>
                    <RadioGroup
                      onValueChange={handleDeliveryMethodChange}
                      value={userData?.deliveryInfo?.deliveryMethod}
                      className="mt-10 flex flex-col justify-between gap-8 md:flex-row md:items-center md:gap-0"
                    >
                      <div className="flex items-center gap-5">
                        <RadioGroupItem value="branch" id="NP-b" />
                        <Label
                          htmlFor="NP-b"
                          className="cursor-pointer select-none text-base font-normal md:text-xl"
                        >
                          У відділення
                        </Label>
                      </div>
                      <div className="flex items-center gap-5">
                        <RadioGroupItem value="postomat" id="NP-p" />
                        <Label
                          htmlFor="NP-p"
                          className="cursor-pointer select-none text-base font-normal md:text-xl"
                        >
                          У поштомат
                        </Label>
                      </div>
                      <div className="flex items-center gap-5">
                        <RadioGroupItem value="courier" id="NP-c" />
                        <Label
                          htmlFor="NP-c"
                          className="cursor-pointer select-none text-base font-normal md:text-xl"
                        >
                          Курʼєром
                        </Label>
                      </div>
                    </RadioGroup>
                    {['branch', 'postomat'].some(
                      (method) =>
                        method == userData?.deliveryInfo?.deliveryMethod,
                    ) ? (
                      <DeliveryProvider
                        control={control}
                        defaultCities={defaultCities.novaPoshta}
                        onCityChange={(newCity) => {
                          setValue('deliveryInfo.city', newCity.label, {
                            shouldValidate: true,
                          })
                          clearErrors('deliveryInfo.branch')
                          const partialData: IUserData<
                            IDeliveryInfo<
                              'branch' | 'postomat' | 'courier',
                              {
                                value: string
                                label: string
                              }
                            >
                          > = {
                            ...userData,
                            deliveryInfo: {
                              ...userData?.deliveryInfo,
                              city: newCity,
                            },
                          }
                          setUserData(partialData)
                        }}
                        onBranchChange={(newBranch) => {
                          setValue('deliveryInfo.branch', newBranch.label, {
                            shouldValidate: true,
                          })
                          const partialData: IUserData<
                            IDeliveryInfo<
                              'branch' | 'postomat' | 'courier',
                              {
                                value: string
                                label: string
                              }
                            >
                          > = {
                            ...userData,
                            deliveryInfo: {
                              ...userData?.deliveryInfo,
                              branch: newBranch,
                            },
                          }
                          setUserData(partialData)
                        }}
                      />
                    ) : (
                      <Controller
                        name="deliveryInfo.courierInfo"
                        control={control}
                        rules={{
                          required: {
                            value: true,
                            message: 'Це поле є обов’язковим',
                          },
                        }}
                        render={({ field }) => (
                          <>
                            <input
                              {...field}
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>,
                              ) => {
                                field.onChange(event)
                                setUserData({
                                  ...useCartStore.getState().cart.userData,
                                  deliveryInfo: {
                                    ...userData.deliveryInfo,
                                    courierInfo: event.target.value,
                                  },
                                })
                              }}
                              placeholder="Вкажіть адресу доставки (місто, вулиця, будинок)"
                              className="mt-6 flex h-[60px] w-full max-w-[90%] rounded-md border border-input bg-transparent px-4 py-[18px] text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:py-[15px] md:text-xl"
                            />
                            <ErrorMessage
                              errors={errors}
                              name={field.name}
                              render={({ messages }) =>
                                messages &&
                                Object.entries(messages).map(
                                  ([type, message]) => (
                                    <p
                                      key={type}
                                      className="mt-1 text-xs text-red-600"
                                    >
                                      {message}
                                    </p>
                                  ),
                                )
                              }
                            />
                          </>
                        )}
                      />

                      // <Input
                      //   placeholder="Вкажіть адресу доставки (місто, вулиця, будинок)"
                      //   name="deliveryInfo.courierInfo"
                      //   control={control}
                      //   // defaultValue={userData?.deliveryInfo?.courierInfo ?? ''}
                      //   rules={{
                      //     required: {
                      //       value: true,
                      //       message: 'Це поле є обов’язковим',
                      //     },
                      //   }}
                      //    className="mt-8 h-[60px] max-w-[90%] px-4 py-[18px] text-base md:py-[15px] md:text-xl"
                      // />
                    )}
                  </>
                )}
              </div>
              <div className="mt-8 flex items-center space-x-2 md:mt-[42px]">
                <RadioGroupItem value="ukrPoshta" id="UP" />
                <Label htmlFor="UP">Укрпошта</Label>
              </div>
            </RadioGroup>
          </fieldset>
        ))}

      {userData?.formStep && userData.formStep >= 2 && (
        <fieldset className="mt-10 md:mt-[50px]">
          <legend className={fieldsetStyle}>Спосіб оплати</legend>

          <RadioGroup
            onValueChange={handlePaymentMethodChange}
            value={userData?.paymentInfo || 'card-payment'}
            className="mt-8 flex flex-col items-start gap-4"
          >
            <div className="flex items-center gap-8">
              <RadioGroupItem value="card-payment" id="card-payment" />
              <Label
                htmlFor="card-payment"
                className="cursor-pointer select-none text-base font-normal md:text-xl"
              >
                Оплата через платіжну систему
              </Label>
            </div>
            <div className="flex items-center gap-8">
              <RadioGroupItem value="COD" id="COD" /> {/* Cash On Delivery */}
              <Label
                htmlFor="COD"
                className="cursor-pointer select-none text-base font-normal md:text-xl"
              >
                Накладений платіж (комісія 20 грн. + 2% від суми)
              </Label>
            </div>
          </RadioGroup>
        </fieldset>
      )}

      {userData?.formStep && userData.formStep >= 3 && (
        <fieldset className="mt-10 md:mt-[50px]">
          <legend className={fieldsetStyle}>Коментар до замовлення</legend>
          <Textarea
            className="mt-8 border border-gray-300"
            placeholder="За потреби напишіть коментар до замовлення"
            rows={5}
            id="comment"
            defaultValue={userData?.comment}
            {...register('comment', { required: true })}
          />

          {errors.comment && <span>This field is required</span>}
        </fieldset>
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
        <button
          type="submit"
          className="mt-8 max-w-[180px] self-center bg-black px-5 py-2 text-white"
        >
          Продовжити
        </button>
      )}
    </form>
  )
})

OrderForm.displayName = 'OrderForm'

export default OrderForm
