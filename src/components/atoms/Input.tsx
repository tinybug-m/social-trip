import { InputHTMLAttributes } from 'react'

interface Inputprops extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = ({ error, className, ...props }: Inputprops) => {
  return (
    <input
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
        error
          ? 'border-red-500 focus:ring-red-200'
          : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
      } ${className}`}
      {...props}
    />
  )
}

export default Input
