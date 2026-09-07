import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { RegisterForm } from './RegisterForm'

const meta: Meta<typeof RegisterForm> = {
  title: 'Organisms/RegisterForm',
  component: RegisterForm,
}

export default meta
type Story = StoryObj<typeof RegisterForm>

export const Default: Story = {
  args: {
    onSubmit: async () => {},
    isPending: false,
  },
}

export const Pending: Story = {
  args: {
    onSubmit: async () => {},
    isPending: true,
  },
}

export const WithServerError: Story = {
  args: {
    onSubmit: async () => {},
    isPending: false,
    serverError: 'An account with this email already exists',
  },
}
