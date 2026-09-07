import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ReelsFeed } from './ReelsFeed'
import { Post } from '@/src/lib/types/entities'

const makeReel = (id: string, caption: string): Post => ({
  id,
  user_id: 'user-1',
  username: 'sara.travels',
  user_image: null,
  media_url:
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  caption,
  location: 'Alborz, Iran',
  location_lat: 36.2,
  location_lng: 51.3,
  type: 'reel',
  average_rating: 4.2,
  ratings_count: 8,
  ratings_sum: 34,
  likes_count: 0,
  comments_count: 5,
  created_at: new Date().toISOString(),
})

const meta: Meta<typeof ReelsFeed> = {
  title: 'Molecules/ReelsFeed',
  component: ReelsFeed,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ReelsFeed>

export const Default: Story = {
  args: {
    initialPosts: [
      makeReel('reel-1', 'First reel'),
      makeReel('reel-2', 'Second reel'),
    ],
  },
  decorators: [
    (Story) => (
      <div className="h-[700px] bg-black relative">
        <Story />
      </div>
    ),
  ],
}

export const Empty: Story = {
  args: {
    initialPosts: [],
  },
  decorators: [
    (Story) => (
      <div className="h-[700px] bg-black relative">
        <Story />
      </div>
    ),
  ],
}
