import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EnableNotificationsBanner } from './EnableNotificationsBanner'

const meta: Meta<typeof EnableNotificationsBanner> = {
  title: 'Molecules/EnableNotificationsBanner',
  component: EnableNotificationsBanner,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Only renders when the browser Notification permission is "default" (not yet asked). In most automated/CI browser contexts this permission defaults to "denied", so this story may render empty there — it displays correctly in a real browser that has not yet been asked for notification permission.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof EnableNotificationsBanner>

export const Default: Story = {}
