import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ReelItem } from './ReelItem'
import { Post } from '@/src/lib/types/entities'

const reelPost: Post = {
  id: 'reel-1',
  user_id: 'user-1',
  username: 'sara.travels',
  user_image: null,
  media_url:
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  caption: 'Golden hour in the mountains #reel',
  location: 'Alborz, Iran',
  location_lat: 36.2,
  location_lng: 51.3,
  type: 'reel',
  average_rating: 4.2,
  ratings_count: 8,
  ratings_sum: 34,
  likes_count: 0,
  comments_count: 5,
  created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
}

const meta: Meta<typeof ReelItem> = {
  title: 'Molecules/ReelItem',
  component: ReelItem,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ReelItem>

export const Default: Story = {
  args: { post: reelPost },
  decorators: [
    (Story) => (
      <div className="h-[700px] bg-black relative">
        <Story />
      </div>
    ),
  ],
}
