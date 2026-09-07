import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PostCard } from './PostCard'
import { Post } from '@/src/lib/types/entities'

const basePost: Post = {
  id: 'post-1',
  user_id: 'user-1',
  username: 'sara.travels',
  user_image: null,
  media_url:
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  caption: 'Sunset over Kashan #travel #iran',
  location: 'Kashan, Iran',
  location_lat: 33.9831,
  location_lng: 51.4364,
  type: 'post',
  average_rating: 4.5,
  ratings_count: 12,
  ratings_sum: 54,
  likes_count: 0,
  comments_count: 3,
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
}

const meta: Meta<typeof PostCard> = {
  title: 'Molecules/PostCard',
  component: PostCard,
}

export default meta
type Story = StoryObj<typeof PostCard>

export const Default: Story = {
  args: { post: basePost },
}

export const Reel: Story = {
  args: {
    post: {
      ...basePost,
      id: 'post-2',
      type: 'reel',
      media_url:
        'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    },
  },
}

export const NoCaptionOrLocation: Story = {
  args: {
    post: {
      ...basePost,
      id: 'post-3',
      caption: null,
      location: null,
      comments_count: 0,
      average_rating: 0,
      ratings_count: 0,
    },
  },
}
