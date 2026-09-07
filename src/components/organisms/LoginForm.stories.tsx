import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LoginForm } from './LoginForm'

const meta: Meta<typeof LoginForm> = {
  title: 'Organisms/LoginForm',
  component: LoginForm,
}

export default meta
type Story = StoryObj<typeof LoginForm>

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
    serverError: 'Invalid email or password',
  },
}
