import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import StarRating from './StarRating'

const meta: Meta<typeof StarRating> = {
  title: 'Atoms/StarRating',
  component: StarRating,
}

export default meta
type Story = StoryObj<typeof StarRating>

export const ReadOnly: Story = {
  args: {
    value: 4,
  },
}

export const Empty: Story = {
  args: {
    value: 0,
  },
}

export const Interactive: Story = {
  render: () => {
    const InteractiveDemo = () => {
      const [value, setValue] = useState(3)
      return <StarRating value={value} onRate={setValue} />
    }
    return <InteractiveDemo />
  },
}

export const Disabled: Story = {
  args: {
    value: 4,
    onRate: () => {},
    disabled: true,
  },
}
