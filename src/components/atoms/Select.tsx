import { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; text: string }[]
}

const Select = (props: SelectProps) => {
  const { options, ...selectProps } = props
  return (
    <div className="relative">
      <select
        {...selectProps}
        className="appearance-none px-4 py-2 rounded-md focus:outline-none bg-gray-800 border-gray-700 w-100"
      >
        {options.map((option) => {
          return <option value={option.value}>{option.text}</option>
        })}
      </select>
    </div>
  )
}

export default Select
