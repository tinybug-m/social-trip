import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Button from './Button'

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
    },
    size: {
      control: 'select',
      options: ['sm', 'normal', 'lg'],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    children: 'Continue',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Cancel',
    variant: 'secondary',
  },
}

export const Outline: Story = {
  args: {
    children: 'Continue with Google',
    variant: 'outline',
  },
}

export const Loading: Story = {
  args: {
    children: 'Logging in...',
    isLoading: true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Save',
    disabled: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-3 p-4">
      <Button size="sm">Small</Button>
      <Button size="normal">Normal</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
