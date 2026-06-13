import { ButtonHTMLAttributes } from 'react'
import { buttonVariants, type ButtonVariants } from './Button.style'

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  isLoading?: boolean
}

const Button = ({
  isLoading,
  className,
  variant,
  size,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={isLoading || props.disabled}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {isLoading ? 'Connecting...' : children}
    </button>
  )
}

export default Button
