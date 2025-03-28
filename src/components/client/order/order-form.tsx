'use client'

import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { RadioGroup, RadioGroupItem } from '@/components/client/ui/radio-group'
import { Controller, useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Label } from '@/components/admin/ui/label'
import { PencilLine } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import DeliveryProvider from './delivery-provider'
import CheckboxSimple from '../ui/checkbox-simple'
import { useCartStore } from '@/store/cartStore'
import Textarea from '../ui/textarea-RHF'
import { Input } from '../ui/input-RHF'
import { cn } from '@/utils/cn'
import Button from '../ui/button'

interface OrderFormRef {
  reset: () => void
}
type Props = {
  defaultCities: {
    novaPoshta?: IDirectoryCity[]
    ukrPoshta?: IDirectoryCity[]
  }
}

type UserDataKeys = keyof IUserData<
  IDeliveryInfo<'branch' | 'postomat' | 'courier', IComboboxData>
>

export const legendStyle = 'text-xl font-bold md:text-2xl'
const radioItemStyle = 'h-5 w-5'
const radioItemFilledStyle =
  'bg-[#e4e4e4] outline outline-[10px] outline-[#e4e4e4] focus:outline ml-[10px]'

const deliveryProviderLabels = {
  novaPoshta: {
    label: {
      uk: 'Нова Пошта',
      en: 'Nova Poshta',
    },
    icon: {
      src: '/images/nova-poshta.webp',
      alt: {
        uk: 'Укрпошта лого',
        en: 'Nova Poshta logo',
      },
      height: 40,
      width: 40,
    },
  },
  ukrPoshta: {
    label: {
      uk: 'Укрпошта',
      en: 'Ukrposhta',
    },
    icon: {
      src: '/images/ukrposhta.webp',
      alt: {
        uk: 'Укрпошта лого',
        en: 'Ukrposhta logo',
      },
      height: 40,
      width: 28,
    },
  },
}

const OrderForm = forwardRef<OrderFormRef, Props>(({ defaultCities }, ref) => {
  const locale = useLocale() as ILocale
  const t = useTranslations('order')
  const [showFieldset, setShowFieldset] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
  })

  const setUserData = useCartStore((state) => state.setCartUserData)
  const userData = useCartStore((state) => state.cart.userData)

  const {
    register,
    handleSubmit,
    setValue,
    control,
    unregister,
    formState: { errors },
    clearErrors,
    watch,
    trigger,
    reset,
  } = useForm<
    IUserData<IDeliveryInfo<'branch' | 'postomat' | 'courier', string>>
  >({
    criteriaMode: 'all',
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const firstRenderRef = useRef(0)

  useEffect(() => {
    if (userData) {
      if (firstRenderRef.current < 2) {
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
        firstRenderRef.current++
      }
    }
  }, [userData, setValue])

  const handleDeliveryProviderChange = (value: string): void => {
    setValue('deliveryInfo.deliveryProvider', value)
    setValue('deliveryInfo.city', '')
    unregister(['deliveryInfo.branch', 'deliveryInfo.courierInfo'])

    const partialData: IUserData<
      IDeliveryInfo<'branch' | 'postomat' | 'courier', IComboboxData>
    > = {
      ...userData,
      deliveryInfo: {
        deliveryProvider: value,
        deliveryMethod: 'branch',
      },
    }

    setUserData(partialData)
  }

  const handleDeliveryMethodChange = (value: IDeliveryMethods): void => {
    setValue('deliveryInfo.deliveryMethod', value, {
      shouldValidate: true,
    })

    if (value === 'courier') {
      unregister(['deliveryInfo.branch', 'deliveryInfo.city'])
    }

    if (value === 'branch' || value === 'postomat') {
      if (userData?.deliveryInfo?.deliveryMethod === 'courier') {
        unregister('deliveryInfo.courierInfo')
        setValue('deliveryInfo.city', '')
      }
      setValue('deliveryInfo.branch', '')
      if (errors.deliveryInfo?.branch) clearErrors('deliveryInfo.branch')
      if (errors.deliveryInfo?.city) clearErrors('deliveryInfo.city')
    }

    const partialData: IUserData<
      IDeliveryInfo<'branch' | 'postomat' | 'courier', IComboboxData>
    > = {
      ...userData,
      deliveryInfo: {
        ...userData?.deliveryInfo,
        city:
          value === 'courier'
            ? {
                value: '',
                label: '',
              }
            : userData?.deliveryInfo?.city,
        branch: {
          value: '',
          label: '',
        },
        deliveryMethod: value,
      },
    }
    setUserData(partialData)
  }
  const handlePaymentMethodChange = (value: PaymentMethods): void => {
    setValue('paymentInfo', value)

    const partialData: IUserData<
      IDeliveryInfo<'branch' | 'postomat' | 'courier', IComboboxData>
    > = {
      ...userData,
      paymentInfo: value,
    }
    setUserData(partialData)
  }

  const handleEditStep = (
    step: keyof typeof showFieldset,
    fields?: UserDataKeys | UserDataKeys[],
  ): void => {
    if ((Array.isArray(fields) && fields.length) || fields) {
      trigger(fields, { shouldFocus: true }).then((isValid) => {
        if (isValid) {
          setShowFieldset((prevState) => ({
            ...prevState,
            [step]: !prevState[step],
          }))
        }
      })
    } else {
      setShowFieldset((prevState) => ({
        ...prevState,
        [step]: !prevState[step],
      }))
    }
  }

  const onSubmit = (
    data: IUserData<IDeliveryInfo<'branch' | 'postomat' | 'courier', string>>,
  ): void => {
    if (!userData?.formStep || userData.formStep < 4) {
      const deliveryInfo: IDeliveryInfo<
        'branch' | 'postomat' | 'courier',
        IComboboxData
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
        IDeliveryInfo<'branch' | 'postomat' | 'courier', IComboboxData>
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
    reset,
  }))

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-[550px] flex-col gap-10 md:gap-[50px] lg:max-w-none"
    >
      <fieldset
        id="step1"
        className={cn(
          'relative flex flex-col',
          userData?.formStep === 4 && 'bg-[hsl(var(--order-background))] p-6',
          userData?.formStep === 4 &&
            showFieldset.step1 &&
            'border border-black bg-transparent',
        )}
      >
        <legend className="sr-only">{t('contacts_title')}</legend>
        <h3 className={cn(legendStyle, 'mb-8')}>{t('contacts_title')}</h3>
        <AnimatePresence initial={false}>
          {(userData?.formStep ?? 1) < 4 || showFieldset.step1 ? (
            <motion.div
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: '0' }}
              initial={{ opacity: 0, height: '0' }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
              className="p-0.5"
            >
              <Input
                placeholder={t('surname_placeholder')}
                name="surname"
                id="surname"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t('validation_required'),
                  },
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const surname = event.target.value
                  setValue('surname', surname)
                  clearErrors('surname')
                  setUserData({
                    ...useCartStore.getState().cart.userData,
                    surname,
                  })
                }}
                className="h-[60px] px-4 py-[18px] text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] md:py-[15px] lg:max-w-[90%]"
              />

              <Input
                placeholder={t('name_placeholder')}
                name="name"
                id="name"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t('validation_required'),
                  },
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const name = event.target.value
                  setValue('name', name)
                  clearErrors('name')
                  setUserData({
                    ...useCartStore.getState().cart.userData,
                    name,
                  })
                }}
                className="mt-6 h-[60px] px-4 py-[18px] text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] md:py-[15px] lg:max-w-[90%]"
              />

              <Input
                placeholder={t('phone_placeholder')}
                name="phoneNumber"
                id="phoneNumber"
                control={control}
                helpText={t('phone_field_description')}
                rules={{
                  required: {
                    value: true,
                    message: t('validation_required'),
                  },
                  minLength: {
                    value: 19,
                    message: t('validation_length'),
                  },
                }}
                onClick={(event) => {
                  const target = event.target as HTMLInputElement

                  setValue(
                    'phoneNumber',
                    (target.value =
                      target.value == '' ? '+38 (0' : target.value),
                  )
                }}
                onChange={(event) => {
                  const target = (
                    event.target as HTMLInputElement
                  ).value.replace(/\D/g, '')
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
                className="mt-6 h-[60px] px-4 py-[18px] text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] md:py-[15px] lg:max-w-[90%]"
              />

              <Input
                placeholder="E-mail"
                name="email"
                id="email"
                control={control}
                rules={{
                  required: {
                    value: true,
                    message: t('validation_required'),
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: t('validation_email_format'),
                  },
                }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const email = event.target.value
                  setValue('email', email)
                  clearErrors('email')
                  setUserData({
                    ...useCartStore.getState().cart.userData,
                    email,
                  })
                }}
                className="mt-6 h-[60px] px-4 py-[18px] text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] md:py-[15px] lg:max-w-[90%]"
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
        {userData?.formStep === 4 && !showFieldset.step1 ? (
          <div className="flex flex-col gap-1 text-[hsl(var(--order-text))]">
            <p>{userData?.name + ' ' + userData?.surname}</p>
            <p>{userData?.phoneNumber}</p>
            <p>{userData?.email}</p>
          </div>
        ) : null}

        <Button
          area-label={t('area-edit')}
          variant={'icons'}
          className={cn(
            'absolute right-6 top-[30px] hidden',
            userData?.formStep === 4 && 'block',
          )}
          onClick={() =>
            handleEditStep('step1', ['name', 'surname', 'phoneNumber', 'email'])
          }
        >
          <PencilLine size={24} />
        </Button>
      </fieldset>

      {userData?.formStep && userData.formStep >= 1 && (
        <fieldset
          id="step2"
          className={cn(
            'relative flex flex-col',
            userData?.formStep === 4 && 'bg-[hsl(var(--order-background))] p-6',
            userData?.formStep === 4 &&
              showFieldset.step2 &&
              'border border-black bg-transparent',
          )}
        >
          <legend className="sr-only">{t('delivery_title')}</legend>
          <h3 className={cn(legendStyle, 'mb-8')}>{t('delivery_title')}</h3>
          <AnimatePresence initial={false}>
            {(userData?.formStep ?? 1) < 4 || showFieldset.step2 ? (
              <motion.div
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: '0' }}
                initial={{ opacity: 0, height: '0' }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <RadioGroup
                  onValueChange={handleDeliveryProviderChange}
                  value={userData?.deliveryInfo?.deliveryProvider}
                >
                  <div className="flex flex-col gap-10">
                    <Label
                      htmlFor="NP"
                      className="flex cursor-pointer select-none items-center gap-10 text-xl font-semibold"
                    >
                      <RadioGroupItem
                        value="novaPoshta"
                        id="NP"
                        className={cn(radioItemStyle, radioItemFilledStyle)}
                        iconSize="large"
                      />
                      <span>
                        <Image
                          src={deliveryProviderLabels.novaPoshta.icon.src}
                          alt={
                            deliveryProviderLabels.novaPoshta.icon.alt[locale]
                          }
                          width={deliveryProviderLabels.novaPoshta.icon.width}
                          height={deliveryProviderLabels.novaPoshta.icon.height}
                          className="mr-3 inline-block"
                        />{' '}
                        {deliveryProviderLabels.novaPoshta.label[locale]}
                      </span>
                    </Label>
                    {userData?.deliveryInfo?.deliveryProvider ==
                      'novaPoshta' && (
                      <>
                        <RadioGroup
                          onValueChange={handleDeliveryMethodChange}
                          value={userData?.deliveryInfo?.deliveryMethod}
                          className="ml-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center lg:gap-0"
                        >
                          <Label
                            htmlFor="NP-b"
                            className="flex cursor-pointer select-none items-center gap-5 text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] font-normal"
                          >
                            <RadioGroupItem
                              value="branch"
                              id="NP-b"
                              className={cn(radioItemStyle)}
                              iconSize="large"
                            />
                            {t('delivery_method_to_branch')}
                          </Label>

                          <Label
                            htmlFor="NP-p"
                            className="flex cursor-pointer select-none items-center gap-5 text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] font-normal"
                          >
                            <RadioGroupItem
                              value="postomat"
                              id="NP-p"
                              className={cn(radioItemStyle)}
                              iconSize="large"
                            />
                            {t('delivery_method_to_postomat')}
                          </Label>

                          <Label
                            htmlFor="NP-c"
                            className="flex cursor-pointer select-none items-center gap-5 text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] font-normal"
                          >
                            <RadioGroupItem
                              value="courier"
                              id="NP-c"
                              className={cn(radioItemStyle)}
                              iconSize="large"
                            />
                            {t('delivery_method_courier')}
                          </Label>
                        </RadioGroup>
                        {['branch', 'postomat'].some(
                          (method) =>
                            method == userData?.deliveryInfo?.deliveryMethod,
                        ) ? (
                          <DeliveryProvider
                            defaultValues={
                              defaultCities[
                                userData?.deliveryInfo?.deliveryProvider
                              ]
                            }
                            control={control}
                            onCityChange={(newCity) => {
                              setValue('deliveryInfo.city', newCity.label, {
                                shouldValidate: true,
                              })
                              setValue('deliveryInfo.branch', '')

                              const partialData: IUserData<
                                IDeliveryInfo<
                                  'branch' | 'postomat' | 'courier',
                                  IComboboxData
                                >
                              > = {
                                ...userData,
                                deliveryInfo: {
                                  ...userData?.deliveryInfo,
                                  city: newCity,
                                  branch: {
                                    value: '',
                                    label: '',
                                  },
                                },
                              }
                              setUserData(partialData)

                              if (errors.deliveryInfo?.branch)
                                clearErrors('deliveryInfo.branch')
                              if (errors.deliveryInfo?.city)
                                clearErrors('deliveryInfo.city')
                            }}
                            onBranchChange={(newBranch) => {
                              setValue('deliveryInfo.branch', newBranch.label, {
                                shouldValidate: true,
                              })
                              const partialData: IUserData<
                                IDeliveryInfo<
                                  'branch' | 'postomat' | 'courier',
                                  IComboboxData
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
                                message: t('validation_required'),
                              },
                            }}
                            render={({ field }) => (
                              <div>
                                <input
                                  {...field}
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>,
                                  ) => {
                                    field.onChange(event)
                                    clearErrors('deliveryInfo.courierInfo')
                                    setUserData({
                                      ...useCartStore.getState().cart.userData,
                                      deliveryInfo: {
                                        ...userData.deliveryInfo,
                                        courierInfo: event.target.value,
                                      },
                                    })
                                  }}
                                  placeholder={t('courier_placeholder')}
                                  className="m-0.5 flex h-[60px] w-full rounded-md border border-input bg-transparent px-4 py-[18px] text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:py-[15px] md:text-xl lg:max-w-[90%]"
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
                              </div>
                            )}
                          />
                        )}
                      </>
                    )}
                  </div>
                  {/* <Label
                    htmlFor="UP"
                    className="mt-8 flex cursor-pointer select-none items-center gap-10 text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] font-normal"
                  >
                    <RadioGroupItem
                      value="ukrPoshta"
                      id="UP"
                      className={cn(radioItemStyle, radioItemFilledStyle)}
                      iconSize="large"
                    />
                    <span>
                      <Image
                        src={deliveryProviderLabels.ukrPoshta.icon.src}
                        alt={deliveryProviderLabels.ukrPoshta.icon.alt[locale]}
                        width={deliveryProviderLabels.ukrPoshta.icon.width}
                        height={deliveryProviderLabels.ukrPoshta.icon.height}
                        className="mr-3 inline-block"
                      />{' '}
                      {deliveryProviderLabels.ukrPoshta.label[locale]}
                    </span>
                  </Label> */}
                </RadioGroup>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {userData?.formStep === 4 && !showFieldset.step2 ? (
            <>
              <div className="mb-7 text-xl font-bold md:text-2xl">
                {userData.deliveryInfo?.deliveryProvider && (
                  <span>
                    <Image
                      src={
                        deliveryProviderLabels[
                          userData.deliveryInfo
                            ?.deliveryProvider as keyof typeof deliveryProviderLabels
                        ].icon.src
                      }
                      alt={
                        deliveryProviderLabels[
                          userData.deliveryInfo
                            ?.deliveryProvider as keyof typeof deliveryProviderLabels
                        ].icon.alt[locale]
                      }
                      width={
                        deliveryProviderLabels[
                          userData.deliveryInfo
                            ?.deliveryProvider as keyof typeof deliveryProviderLabels
                        ].icon.width
                      }
                      height={
                        deliveryProviderLabels[
                          userData.deliveryInfo
                            ?.deliveryProvider as keyof typeof deliveryProviderLabels
                        ].icon.height
                      }
                      className="mr-3 inline-block"
                    />{' '}
                    {
                      deliveryProviderLabels[
                        userData.deliveryInfo
                          ?.deliveryProvider as keyof typeof deliveryProviderLabels
                      ].label[locale]
                    }
                  </span>
                )}
              </div>
              {userData.deliveryInfo?.courierInfo ? (
                <div className="flex flex-col gap-1 text-[hsl(var(--order-text))]">
                  <p className="text-[hsl(var(--order-text))]">
                    {userData?.deliveryInfo?.courierInfo}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1 text-[hsl(var(--order-text))]">
                  <p className="text-[hsl(var(--order-text))]">
                    {userData?.deliveryInfo?.city?.label}
                  </p>
                  <p className="text-[hsl(var(--order-text))]">
                    {userData?.deliveryInfo?.branch?.label}
                  </p>
                </div>
              )}
            </>
          ) : null}
          <Button
            area-label={t('area-edit')}
            variant={'icons'}
            className={cn(
              'absolute right-6 top-[30px] hidden',
              userData?.formStep === 4 && 'block',
            )}
            onClick={() => handleEditStep('step2')}
          >
            <PencilLine size={24} />
          </Button>
        </fieldset>
      )}

      {userData?.formStep && userData.formStep >= 2 && (
        <fieldset
          id="step3"
          className={cn(
            'relative flex flex-col',
            userData?.formStep === 4 && 'bg-[hsl(var(--order-background))] p-6',
            userData?.formStep === 4 &&
              showFieldset.step3 &&
              'border border-black bg-transparent',
          )}
        >
          <legend className="sr-only">{t('payment_title')}</legend>
          <h3 className={cn(legendStyle, 'mb-8')}>{t('payment_title')}</h3>
          <AnimatePresence initial={false}>
            {(userData?.formStep ?? 1) < 4 || showFieldset.step3 ? (
              <motion.div
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: '0' }}
                initial={{ opacity: 0, height: '0' }}
                transition={{ duration: 0.3 }}
                style={{ overflow: 'hidden' }}
              >
                <RadioGroup
                  onValueChange={handlePaymentMethodChange}
                  value={userData?.paymentInfo || 'card'}
                  className="flex flex-col items-start gap-6 py-[10px]"
                >
                  <Label
                    htmlFor="card"
                    className="flex cursor-pointer select-none items-center gap-10 text-base font-normal md:text-xl"
                  >
                    <RadioGroupItem
                      value="card"
                      id="card"
                      className={cn(radioItemStyle, radioItemFilledStyle)}
                      iconSize="large"
                    />
                    {t('card')}
                  </Label>
                  <Label
                    htmlFor="cash"
                    className="flex cursor-pointer select-none items-center gap-10 text-base font-normal md:text-xl"
                  >
                    <RadioGroupItem
                      value="cash"
                      id="cash"
                      className={cn(radioItemStyle, radioItemFilledStyle)}
                      iconSize="large"
                    />
                    {t('cash')}
                  </Label>
                </RadioGroup>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {userData?.formStep === 4 && !showFieldset.step3 ? (
            <div className="text-[hsl(var(--order-text))]">
              {t(userData.paymentInfo)}
            </div>
          ) : null}
          <Button
            area-label={t('area-edit')}
            variant={'icons'}
            className={cn(
              'absolute right-6 top-[30px] hidden',
              userData?.formStep === 4 && 'block',
            )}
            onClick={() => handleEditStep('step3')}
          >
            <PencilLine size={24} />
          </Button>
        </fieldset>
      )}

      {userData?.formStep && userData.formStep >= 3 && (
        <>
          <fieldset
            id="step4"
            className={cn(
              'relative flex flex-col',
              userData?.formStep === 4 &&
                'bg-[hsl(var(--order-background))] p-6',
              userData?.formStep === 4 &&
                showFieldset.step4 &&
                'border border-black bg-transparent',
            )}
          >
            <legend className="sr-only">{t('comment_title')}</legend>
            <h3 className={cn(legendStyle)}>{t('comment_title')}</h3>
            <AnimatePresence initial={false}>
              {(userData?.formStep ?? 1) < 4 || showFieldset.step4 ? (
                <motion.div
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: '0' }}
                  initial={{ opacity: 0, height: '0' }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden', width: '100%' }}
                >
                  <Textarea
                    name="comment"
                    placeholder={t('comment_placeholder')}
                    rows={5}
                    control={control}
                    id="comment"
                    onChange={(
                      event: React.ChangeEvent<HTMLTextAreaElement>,
                    ) => {
                      const comment = event.target.value
                      setValue('comment', comment)
                      clearErrors('comment')
                      setUserData({
                        ...useCartStore.getState().cart.userData,
                        comment,
                      })
                    }}
                    className="m-0.5 mt-8 w-[99%] resize-none border border-gray-300 text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)]"
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>

            {userData?.formStep === 4 && !showFieldset.step4 ? (
              <div className="mt-8 text-[hsl(var(--order-text))]">
                {userData.comment || t('no_comments')}
              </div>
            ) : null}
            <Button
              area-label={t('area-edit')}
              variant={'icons'}
              className={cn(
                'absolute right-6 top-[30px] hidden',
                userData?.formStep === 4 && 'block',
              )}
              onClick={() => handleEditStep('step4')}
            >
              <PencilLine size={24} />
            </Button>
          </fieldset>
          <CheckboxSimple
            label={t('no_call')}
            {...register('noCall')}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const noCall = event.target.checked
              setValue('noCall', noCall)
              clearErrors('noCall')
              setUserData({
                ...useCartStore.getState().cart.userData,
                noCall,
              })
            }}
            isValid={Boolean(errors.noCall)}
            isChecked={watch('noCall')}
          />
        </>
      )}

      {/* {userData?.formStep && userData.formStep >= 4 && (
        <fieldset
          aria-disabled={userData?.formStep === 5 && showFieldset.step5}
          tabIndex={userData?.formStep === 5 && showFieldset.step5 ? -1 : 0}
          className={cn(
            'relative flex flex-col gap-4 text-[clamp(14px,calc(14px+6*(100vw-768px)/672),20px)]',
            userData?.formStep === 5 &&
              'pointer-events-none bg-[hsl(var(--order-background))] p-6 text-[hsl(var(--order-text))]',
            showFieldset.step5 &&
              'pointer-events-auto border border-black bg-transparent p-6',
          )}
        >
          <div>
            <CheckboxSimple
              label={t('personal_data_consent')}
              {...register('acceptTerms', {
                required: {
                  value: true,
                  message: 'Це поле є обов’язковим',
                },
              })}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const acceptTerms = event.target.checked
                setValue('acceptTerms', acceptTerms)
                clearErrors('acceptTerms')
                setUserData({
                  ...useCartStore.getState().cart.userData,
                  acceptTerms,
                })
              }}
              isValid={Boolean(errors.acceptTerms)}
              isChecked={watch('acceptTerms')}
            />
            <ErrorMessage
              errors={errors}
              name="acceptTerms"
              render={({ messages }) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p key={type} className="mt-1 text-xs text-red-600">
                    {message}
                  </p>
                ))
              }
            />
          </div>
          <CheckboxSimple
            label={t('no_call')}
            {...register('noCall')}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const noCall = event.target.checked
              setValue('noCall', noCall)
              clearErrors('noCall')
              setUserData({
                ...useCartStore.getState().cart.userData,
                noCall,
              })
            }}
            isValid={Boolean(errors.noCall)}
            isChecked={watch('noCall')}
          />
          <Button
            area-label={t('area-edit')}
            variant={'icons'}
            className={cn(
              'pointer-events-auto absolute right-6 top-[30px] hidden text-black',
              userData?.formStep === 5 && 'block',
            )}
            onClick={() => handleEditStep('step5', 'acceptTerms')}
          >
            <PencilLine size={24} />
          </Button>
        </fieldset>
      )} */}

      {(!userData || (userData?.formStep ?? 0) <= 3) && (
        <button
          type="submit"
          className="max-w-[180px] self-center bg-black px-5 py-2 text-white"
        >
          {t('btn_continue')}
        </button>
      )}
    </form>
  )
})

OrderForm.displayName = 'OrderForm'

export default OrderForm
