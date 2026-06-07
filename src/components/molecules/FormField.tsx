import { ReactElement } from 'react'

interface FormFieldProps {
  children: ReactElement
  label: string
  error?: string
}

const FormField = ({ children, label, error }: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-semibold text-gray-300">{label}</label>
      {children}
      {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
    </div>
  )
}

export default FormField
