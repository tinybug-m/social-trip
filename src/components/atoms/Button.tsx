import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}
// TODO : install cvs 
// TODO : use cvs for Button component

const Button = ({ isLoading, className, children, ...props }: ButtonProps) => {
  return (
    <button
      disabled={isLoading || props.disabled}
      className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {isLoading ? 'Connecting...' : children}
    </button>
  )
}

export default Button
