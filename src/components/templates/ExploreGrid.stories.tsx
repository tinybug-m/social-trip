import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import ExploreGrid from './ExploreGrid'
import { Tables } from '@/src/lib/types/database'

const makeItem = (
  id: string,
  type: 'post' | 'reel',
  media: string,
): Tables<'posts'> => ({
  id,
  user_id: 'user-1',
  username: 'sara.travels',
  user_image: null,
  media_url: media,
  caption: `Sample ${type}`,
  location: 'Kashan, Iran',
  location_lat: 33.9831,
  location_lng: 51.4364,
  type,
  average_rating: 4.3,
  ratings_count: 6,
  ratings_sum: 26,
  likes_count: 0,
  comments_count: 2,
  created_at: new Date().toISOString(),
})

const images = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400',
]

const feed = images.map((url, i) =>
  makeItem(`post-${i}`, i === 2 ? 'reel' : 'post', url),
)

const meta: Meta<typeof ExploreGrid> = {
  title: 'Templates/ExploreGrid',
  component: ExploreGrid,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ExploreGrid>

export const Default: Story = {
  args: { feed },
}

export const Empty: Story = {
  args: { feed: [] },
}
