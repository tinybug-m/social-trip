import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import BottomNavigation from './BottomNavigation'

const meta: Meta<typeof BottomNavigation> = {
  title: 'Molecules/BottomNavigation',
  component: BottomNavigation,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof BottomNavigation>

export const OnFeed: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/feed' } },
  },
}

export const OnExplore: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/explore' } },
  },
}
