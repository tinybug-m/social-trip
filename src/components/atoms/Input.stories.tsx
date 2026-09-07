import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Input from './Input'

const meta: Meta<typeof Input> = {
  title: 'Atoms/Input',
  component: Input,
}

export default meta
type Story = StoryObj<typeof Input>

export const Default: Story = {
  args: {
    placeholder: 'you@example.com',
    type: 'email',
  },
}

export const WithError: Story = {
  args: {
    placeholder: 'you@example.com',
    type: 'email',
    error: true,
    defaultValue: 'not-an-email',
  },
}

export const Password: Story = {
  args: {
    placeholder: '••••••••',
    type: 'password',
  },
}
