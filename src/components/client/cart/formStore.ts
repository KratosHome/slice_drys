import { create } from 'zustand'

interface FormData {
  name: string
  surname: string
  phoneNumber: string
  email: string
}

interface FormState {
  formData: FormData | null
  setFormData: (data: FormData) => void
}

const getInitialData = (): FormData | null => {
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
