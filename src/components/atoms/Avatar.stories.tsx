import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import Avatar from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
}

export default meta
type Story = StoryObj<typeof Avatar>

export const WithImage: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200',
    name: 'Sara Travels',
    size: 48,
  },
}

export const Fallback: Story = {
  args: {
    src: null,
    name: 'Sara Travels',
    size: 48,
  },
}

export const WithRing: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200',
    name: 'Sara Travels',
    size: 56,
    ring: true,
  },
}

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-3 p-4">
      <Avatar name="Sara" size={24} />
      <Avatar name="Sara" size={32} />
      <Avatar name="Sara" size={48} />
      <Avatar name="Sara" size={64} />
    </div>
  ),
}
