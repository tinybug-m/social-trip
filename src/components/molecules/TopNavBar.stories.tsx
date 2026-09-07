import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import TopNavBar from './TopNavBar'

const meta: Meta<typeof TopNavBar> = {
  title: 'Molecules/TopNavBar',
  component: TopNavBar,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof TopNavBar>

export const Default: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/feed' } },
  },
}

export const CreatePost: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/create-post' } },
  },
}

export const Messages: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/messages' } },
  },
}

export const Explore: Story = {
  parameters: {
    nextjs: { navigation: { pathname: '/explore' } },
  },
}
