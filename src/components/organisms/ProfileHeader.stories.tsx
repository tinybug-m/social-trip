import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ProfileHeader } from './ProfileHeader'

const meta: Meta<typeof ProfileHeader> = {
  title: 'Organisms/ProfileHeader',
  component: ProfileHeader,
}

export default meta
type Story = StoryObj<typeof ProfileHeader>

export const OwnProfile: Story = {
  args: {
    username: 'sara.travels',
    bio: 'Exploring one city at a time ✈️',
    avatarUrl:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200',
    postsCount: 24,
    averageRating: 4.6,
  },
}

export const OtherUserProfile: Story = {
  args: {
    username: 'ali.explorer',
    bio: 'Mountains > beaches',
    avatarUrl: null,
    postsCount: 8,
    averageRating: 4.1,
    otherUserId: 'user-2',
  },
}

export const NoBioOrPosts: Story = {
  args: {
    username: 'newuser',
    bio: null,
    avatarUrl: null,
    postsCount: 0,
    averageRating: 0,
  },
}
