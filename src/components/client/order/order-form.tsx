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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Label } from '@/components/ui/label'
import { PencilLine } from 'lucide-react'

import DeliveryProvider from './delivery-provider'
import CheckboxSimple from '@/components/ui/checkbox-simple'
import { useCartStore } from '@/store/cart-store'
import Textarea from '@/components/ui/textarea-RHF'
import { Input } from '@/components/ui/input-RHF'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import { LazyMotion, domAnimation, m, AnimatePresence } from 'framer-motion'
import { getCartAnalyticsItems, trackEcommerceEvent } from '@/utils/analytics'
import { formatOrderPhoneInput, isValidOrderPhone } from '@/utils/order-contact'

export const ORDER_FORM_ID = 'checkout-form'

interface OrderFormRef {
  reset: () => void
}

type Props = {
  defaultCities: {
    novaPoshta?: IDirectoryCity[]
    ukrPoshta?: IDirectoryCity[]
  }
  onFinalSubmit: (
    userData: IUserData<
      IDeliveryInfo<'branch' | 'postomat' | 'courier', IComboboxData>
    >,
  ) => void
  onValidityChange: (valid: boolean) => void
  submitting: boolean
}

type UserDataKeys = keyof IUserData<
  IDeliveryInfo<'branch' | 'postomat' | 'courier', IComboboxData>
>

const legendStyle = 'text-xl font-bold md:text-2xl'
const radioItemStyle = 'h-5 w-5 cursor-pointer'
const radioItemFilledStyle =
  'bg-border outline outline-[10px] outline-border focus:outline ml-[10px] focus:outline-[10px]'

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

const OrderForm = forwardRef<OrderFormRef, Props>(
  ({ defaultCities, onFinalSubmit, onValidityChange, submitting }, ref) => {
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
    const { totalPrice, minOrderAmount } = useCartStore((state) => state)
    const trackedShipping = useRef<string | undefined>(undefined)
    const trackedPayment = useRef<string | undefined>(undefined)

    const {
      register,
      handleSubmit,
      setValue,
      control,
      unregister,
      formState: { errors, isValid },
      clearErrors,
      trigger,
      reset,
    } = useForm<
      IUserData<IDeliveryInfo<'branch' | 'postomat' | 'courier', string>>
    >({
      criteriaMode: 'all',
      mode: 'onChange',
      reValidateMode: 'onChange',
    })

    useEffect(() => {
      onValidityChange(isValid)
    }, [isValid, onValidityChange])

    const noCall = useWatch({
      control,
      name: 'noCall',
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
          setValue(
            'deliveryInfo.courierInfo',
            userData.deliveryInfo?.courierInfo,
          )
          setValue('paymentInfo', userData.paymentInfo)
          setValue('comment', userData.comment)
          setValue('acceptTerms', userData.acceptTerms)
          setValue('noCall', userData.noCall)
          firstRenderRef.current++
          // Restoring values does not recompute isValid. All active controllers
          // are mounted by this effect, so validate the complete restored form.
          if ((userData.formStep ?? 0) >= 1) void trigger()
        }

        const { name, surname, phoneNumber, email, formStep } = userData
        if (!formStep || formStep < 1) {
          const isNameValid = !!name?.trim()
          const isSurnameValid = !!surname?.trim()
          const isPhoneValid = isValidOrderPhone(phoneNumber)
          const isEmailValid =
            email &&
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)

          if (isNameValid && isSurnameValid && isPhoneValid && isEmailValid) {
            setUserData({ ...userData, formStep: 1 })
          }
        }
      }
    }, [userData, setValue, setUserData, trigger])

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
      if (
        submitting ||
        ((userData?.formStep ?? 0) >= 3 && totalPrice < minOrderAmount)
      )
        return
      const items = getCartAnalyticsItems(
        useCartStore.getState().cart.itemList ?? [],
      )
      // These events run only after the active form fields pass validation.
      if ((userData?.formStep ?? 0) >= 1) {
        const shippingTier = `${userData?.deliveryInfo?.deliveryProvider ?? 'novaPoshta'}:${userData?.deliveryInfo?.deliveryMethod ?? 'branch'}`
        if (trackedShipping.current !== shippingTier) {
          if (
            trackEcommerceEvent('add_shipping_info', items, {
              shipping_tier: shippingTier,
            })
          ) {
            trackedShipping.current = shippingTier
          }
        }
      }
      if ((userData?.formStep ?? 0) >= 2) {
        const paymentType = userData?.paymentInfo ?? 'card'
        if (trackedPayment.current !== paymentType) {
          if (
            trackEcommerceEvent('add_payment_info', items, {
              payment_type: paymentType,
            })
          ) {
            trackedPayment.current = paymentType
          }
        }
      }
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
          (userData?.formStep ?? 0) < 3
            ? (userData?.formStep ?? 0) + 1
            : userData?.formStep,
      }
      setUserData(partialData)
      if ((userData?.formStep ?? 0) < 3) {
        return
      } else {
        onFinalSubmit(partialData)
      }
    }

    useImperativeHandle(ref, () => ({
      reset,
    }))

    return (
      <form
        id={ORDER_FORM_ID}
        noValidate
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event)
        }}
        className="flex w-full max-w-[550px] flex-col gap-10 md:gap-[50px] lg:max-w-none"
      >
        <fieldset
          id="step1"
          className={cn(
            'relative flex flex-col',
            userData?.formStep === 4 && 'bg-order-background p-6',
            userData?.formStep === 4 &&
              showFieldset.step1 &&
              'border-foreground border bg-transparent',
          )}
        >
          <legend className="sr-only">{t('contacts-title')}</legend>
          <h3 className={cn(legendStyle, 'mb-8')}>{t('contacts-title')}</h3>
          <AnimatePresence initial={false}>
            {(userData?.formStep ?? 1) < 4 || showFieldset.step1 ? (
              <LazyMotion features={domAnimation}>
                <m.div
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: '0' }}
                  initial={{ opacity: 0, height: '0' }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                  className="p-0.5"
                >
                  <Label htmlFor="surname" className="sr-only">
                    {t('surname-placeholder')}
                  </Label>
                  <Input
                    placeholder={t('surname-placeholder')}
                    name="surname"
                    id="surname"
                    autoComplete="family-name"
                    maxLength={120}
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: t('validation-required'),
                      },
                      validate: (value) =>
                        !!String(value ?? '').trim() ||
                        t('validation-required'),
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

                  <Label htmlFor="name" className="sr-only">
                    {t('name-placeholder')}
                  </Label>
                  <Input
                    placeholder={t('name-placeholder')}
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    maxLength={120}
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: t('validation-required'),
                      },
                      validate: (value) =>
                        !!String(value ?? '').trim() ||
                        t('validation-required'),
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

                  <Label htmlFor="phoneNumber" className="sr-only">
                    {t('phone-placeholder')}
                  </Label>
                  <Input
                    placeholder={t('phone-placeholder')}
                    name="phoneNumber"
                    id="phoneNumber"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    control={control}
                    helpText={t('phone-field-description')}
                    rules={{
                      required: {
                        value: true,
                        message: t('validation-required'),
                      },
                      validate: (value) =>
                        isValidOrderPhone(value) || t('validation-phone'),
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
                      const phoneNumber = formatOrderPhoneInput(
                        (event.target as HTMLInputElement).value,
                      )
                      setValue('phoneNumber', phoneNumber, {
                        shouldValidate: true,
                      })
                      clearErrors('phoneNumber')
                      setUserData({
                        ...useCartStore.getState().cart.userData,
                        phoneNumber,
                      })
                    }}
                    className="mt-6 h-[60px] px-4 py-[18px] text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] md:py-[15px] lg:max-w-[90%]"
                  />

                  <Label htmlFor="email" className="sr-only">
                    E-mail
                  </Label>
                  <Input
                    placeholder="E-mail"
                    name="email"
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    maxLength={150}
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: t('validation-required'),
                      },
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: t('validation-email-format'),
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
                </m.div>
              </LazyMotion>
            ) : null}
          </AnimatePresence>
          {userData?.formStep === 4 && !showFieldset.step1 ? (
            <div className="text-order-text flex flex-col gap-1">
              <p>{userData?.name + ' ' + userData?.surname}</p>
              <p>{userData?.phoneNumber}</p>
              <p>{userData?.email}</p>
            </div>
          ) : null}

          <Button
            area-label={t('area-edit')}
            variant={'icons'}
            className={cn(
              'absolute top-[30px] right-6 hidden',
              userData?.formStep === 4 && 'block',
            )}
            onClick={() =>
              handleEditStep('step1', [
                'name',
                'surname',
                'phoneNumber',
                'email',
              ])
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
              userData?.formStep === 4 && 'bg-order-background p-6',
              userData?.formStep === 4 &&
                showFieldset.step2 &&
                'border-foreground border bg-transparent',
            )}
          >
            <legend className="sr-only">{t('delivery-title')}</legend>
            <h3 className={cn(legendStyle, 'mb-8')}>{t('delivery-title')}</h3>
            <AnimatePresence initial={false}>
              {(userData?.formStep ?? 1) < 4 || showFieldset.step2 ? (
                <LazyMotion features={domAnimation}>
                  <m.div
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
                          className="flex cursor-pointer items-center gap-10 text-xl font-semibold select-none"
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
                                deliveryProviderLabels.novaPoshta.icon.alt[
                                  locale
                                ]
                              }
                              width={
                                deliveryProviderLabels.novaPoshta.icon.width
                              }
                              height={
                                deliveryProviderLabels.novaPoshta.icon.height
                              }
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
                                className="flex cursor-pointer items-center gap-5 text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] font-normal select-none"
                              >
                                <RadioGroupItem
                                  value="branch"
                                  id="NP-b"
                                  className={cn(radioItemStyle)}
                                  iconSize="large"
                                />
                                {t('delivery-method-to-branch')}
                              </Label>

                              <Label
                                htmlFor="NP-p"
                                className="flex cursor-pointer items-center gap-5 text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] font-normal select-none"
                              >
                                <RadioGroupItem
                                  value="postomat"
                                  id="NP-p"
                                  className={cn(radioItemStyle)}
                                  iconSize="large"
                                />
                                {t('delivery-method-to-postomat')}
                              </Label>

                              <Label
                                htmlFor="NP-c"
                                className="flex cursor-pointer items-center gap-5 text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)] font-normal select-none"
                              >
                                <RadioGroupItem
                                  value="courier"
                                  id="NP-c"
                                  className={cn(radioItemStyle)}
                                  iconSize="large"
                                />
                                {t('delivery-method-courier')}
                              </Label>
                            </RadioGroup>
                            {['branch', 'postomat'].some(
                              (method) =>
                                method ==
                                userData?.deliveryInfo?.deliveryMethod,
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
                                  setValue(
                                    'deliveryInfo.branch',
                                    newBranch.label,
                                    {
                                      shouldValidate: true,
                                    },
                                  )
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
                                    message: t('validation-required'),
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
                                          ...useCartStore.getState().cart
                                            .userData,
                                          deliveryInfo: {
                                            ...userData.deliveryInfo,
                                            courierInfo: event.target.value,
                                          },
                                        })
                                      }}
                                      placeholder={t('courier-placeholder')}
                                      className="border-input file:text-foreground placeholder:text-muted-foreground focus-visible:ring-ring m-0.5 flex h-[60px] w-full rounded-md border bg-transparent px-4 py-[18px] text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:py-[15px] md:text-xl lg:max-w-[90%]"
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
                  </m.div>
                </LazyMotion>
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
                  <div className="text-order-text flex flex-col gap-1">
                    <p className="text-order-text">
                      {userData?.deliveryInfo?.courierInfo}
                    </p>
                  </div>
                ) : (
                  <div className="text-order-text flex flex-col gap-1">
                    <p className="text-order-text">
                      {userData?.deliveryInfo?.city?.label}
                    </p>
                    <p className="text-order-text">
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
                'absolute top-[30px] right-6 hidden',
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
              userData?.formStep === 4 && 'bg-order-background p-6',
              userData?.formStep === 4 &&
                showFieldset.step3 &&
                'border-foreground border bg-transparent',
            )}
          >
            <legend className="sr-only">{t('payment-title')}</legend>
            <h3 className={cn(legendStyle, 'mb-8')}>{t('payment-title')}</h3>
            <AnimatePresence initial={false}>
              {(userData?.formStep ?? 1) < 4 || showFieldset.step3 ? (
                <LazyMotion features={domAnimation}>
                  <m.div
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
                        className="flex cursor-pointer items-center gap-10 text-base font-normal select-none md:text-xl"
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
                        className="flex cursor-pointer items-center gap-10 text-base font-normal select-none md:text-xl"
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
                  </m.div>
                </LazyMotion>
              ) : null}
            </AnimatePresence>

            {userData?.formStep === 4 && !showFieldset.step3 ? (
              <div className="text-order-text">{userData.paymentInfo}</div>
            ) : null}
            <Button
              area-label={t('area-edit')}
              variant={'icons'}
              className={cn(
                'absolute top-[30px] right-6 hidden',
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
                userData?.formStep === 4 && 'bg-order-background p-6',
                userData?.formStep === 4 &&
                  showFieldset.step4 &&
                  'border-foreground border bg-transparent',
              )}
            >
              <legend className="sr-only">{t('comment-title')}</legend>
              <h3 className={cn(legendStyle)}>{t('comment-title')}</h3>
              <AnimatePresence initial={false}>
                {(userData?.formStep ?? 1) < 4 || showFieldset.step4 ? (
                  <LazyMotion features={domAnimation}>
                    <m.div
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: '0' }}
                      initial={{ opacity: 0, height: '0' }}
                      transition={{ duration: 0.3 }}
                      style={{ overflow: 'hidden', width: '100%' }}
                    >
                      <Textarea
                        name="comment"
                        placeholder={t('comment-placeholder')}
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
                        className="border-foreground/30 m-0.5 mt-8 w-[99%] resize-none border text-[clamp(16px,calc(16px+4*(100vw-768px)/672),20px)]"
                      />
                    </m.div>
                  </LazyMotion>
                ) : null}
              </AnimatePresence>

              {userData?.formStep === 4 && !showFieldset.step4 ? (
                <div className="text-order-text mt-8">
                  {userData.comment || t('no-comments')}
                </div>
              ) : null}
              <Button
                area-label={t('area-edit')}
                variant={'icons'}
                className={cn(
                  'absolute top-[30px] right-6 hidden',
                  userData?.formStep === 4 && 'block',
                )}
                onClick={() => handleEditStep('step4')}
              >
                <PencilLine size={24} />
              </Button>
            </fieldset>
            <CheckboxSimple
              label={t('no-call')}
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
              isChecked={noCall ?? false}
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
              'pointer-events-none bg-order-background p-6 text-order-text',
            showFieldset.step5 &&
              'pointer-events-auto border border-foreground bg-transparent p-6',
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
            label={t('no-call')}
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
        {(!userData || (userData.formStep ?? 0) <= 3) && (
          <button
            type="submit"
            disabled={
              submitting ||
              ((userData?.formStep ?? 0) >= 3 &&
                (totalPrice < minOrderAmount || !isValid))
            }
            className="bg-foreground text-background max-w-[180px] cursor-pointer self-center px-5 py-2"
          >
            {(userData?.formStep ?? 0) < 3 ? t('btn-continue') : t('order')}
          </button>
        )}
      </form>
    )
  },
)

OrderForm.displayName = 'OrderForm'

export default OrderForm
