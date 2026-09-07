import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import GoogleSignInButton from './GoogleSignInButton'

const meta: Meta<typeof GoogleSignInButton> = {
  title: 'Atoms/GoogleSignInButton',
  component: GoogleSignInButton,
}

export default meta
type Story = StoryObj<typeof GoogleSignInButton>

export const Default: Story = {
  args: {
    onClick: () => alert('Redirects to Google OAuth'),
  },
}

export const Loading: Story = {
  args: {
    onClick: () => {},
    isLoading: true,
  },
}
