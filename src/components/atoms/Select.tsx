import { SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; text: string }[]
}

const Select = (props: SelectProps) => {
  const { options, ...selectProps } = props
  return (
    <div className="relative">
      <select
        {...selectProps}
        className="appearance-none px-4 py-2 pe-9 rounded-md focus:outline-none bg-white text-[#262626] border border-[#dbdbdb] w-full"
      >
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          )
        })}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400"
      />
    </div>
  )
}

export default Select
