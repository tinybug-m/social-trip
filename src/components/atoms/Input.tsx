import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input = ({ error, className, ...props }: InputProps) => {
  return (
    <input
      className={`w-full px-3 py-2 text-sm border rounded-sm bg-[#fafafa] focus:outline-none focus:ring-1 transition-all ${
        error
          ? 'border-red-500 focus:ring-red-200'
          : 'border-[#dbdbdb] focus:ring-neutral-300 focus:border-neutral-400'
      } ${className ?? ''}`}
      {...props}
    />
  )
}

export default Input
