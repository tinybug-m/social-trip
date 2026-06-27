import { IconProps } from '.'

export const Search = ({ size = 24, ...props }: IconProps) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle
      cx="8.33337"
      cy="8.33331"
      r="6.6"
      stroke="black"
      strokeWidth="1.8"
    />
    <path
      d="M18.3334 18.3333L13.3334 13.3333"
      stroke="black"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
)
