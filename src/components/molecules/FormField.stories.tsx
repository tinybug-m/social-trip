import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import FormField from './FormField'
import Input from '@/src/components/atoms/Input'

const meta: Meta<typeof FormField> = {
  title: 'Molecules/FormField',
  component: FormField,
}

export default meta
type Story = StoryObj<typeof FormField>

export const Default: Story = {
  args: {
    label: 'Email Address',
    children: <Input type="email" placeholder="you@example.com" />,
  },
}

export const WithError: Story = {
  args: {
    label: 'Email Address',
    error: 'Please enter a valid email address',
    children: <Input type="email" error defaultValue="not-an-email" />,
  },
}
