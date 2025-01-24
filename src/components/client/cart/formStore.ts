import { create } from 'zustand'

interface CartFormData {
  name: string
  surname: string
  phoneNumber: string
  email: string
  formStep: number
  deliveryInfo: string
  paymentInfo: string
  comment: string
  acceptTerms: boolean
  noCall: boolean
}

interface FormState {
  formData: CartFormData | null
  setFormData: (data: CartFormData) => void
}

const getInitialData = (): CartFormData | null => {
  const savedData = localStorage.getItem('formData')
  return savedData ? JSON.parse(savedData) : null
}

const useFormStore = create<FormState>((set) => ({
  formData: getInitialData(),
  setFormData: (data) => {
    localStorage.setItem('formData', JSON.stringify(data))
    set({ formData: data })
  },
}))

export default useFormStore
