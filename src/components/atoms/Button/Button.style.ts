import { cva, VariantProps } from 'class-variance-authority'
export type ButtonVariants = VariantProps<typeof buttonVariants>
export const buttonVariants = cva(
  [
    'w-full',
    'font-medium',
    'rounded-md',
    'transition-colors',
    'cursor-pointer',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
  ],
  {
    variants: {
      variant: {
        primary: ['text-white', 'bg-blue-600', 'hover:bg-blue-700'],
        secondary: ['bg-gray-200', 'text-black', 'hover:bg-gray-300'],
      },
      size: {
        normal: ['py-2', 'px-4'],
        sm: ['py-1', 'px-3', 'text-sm'],
        lg: ['py-3', 'px-6'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'normal',
    },
  },
)
