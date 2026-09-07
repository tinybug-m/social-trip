import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CommentItem } from './CommentItem'
import { Comment } from '@/src/lib/types/entities'

const baseComment: Comment = {
  id: 'comment-1',
  post_id: 'post-1',
  parent_comment_id: null,
  user_id: 'user-2',
  username: 'ali.explorer',
  user_image: null,
  content: 'This place looks amazing! Where exactly is it?',
  likes_count: 4,
  created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
}

const meta: Meta<typeof CommentItem> = {
  title: 'Molecules/CommentItem',
  component: CommentItem,
}

export default meta
type Story = StoryObj<typeof CommentItem>

const noop = async () => {}

export const Default: Story = {
  args: {
    comment: baseComment,
    isOwn: false,
    liked: false,
    onToggleLike: () => {},
    onReply: () => {},
    onEdit: noop,
    onDelete: () => {},
  },
}

export const Liked: Story = {
  args: {
    ...Default.args,
    liked: true,
  },
}

export const OwnComment: Story = {
  args: {
    ...Default.args,
    isOwn: true,
  },
}

export const Reply: Story = {
  args: {
    ...Default.args,
    isReply: true,
    onReply: undefined,
  },
}
