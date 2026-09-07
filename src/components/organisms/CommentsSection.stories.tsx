import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { CommentsSection } from './CommentsSection'
import { Comment } from '@/src/lib/types/entities'

const postId = 'post-1'

const comments: Comment[] = [
  {
    id: 'c1',
    post_id: postId,
    parent_comment_id: null,
    user_id: 'user-2',
    username: 'ali.explorer',
    user_image: null,
    content: 'This place looks amazing! Where exactly is it?',
    likes_count: 4,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'c2',
    post_id: postId,
    parent_comment_id: 'c1',
    user_id: 'user-1',
    username: 'sara.travels',
    user_image: null,
    content: "It's Kashan, Iran! Highly recommend visiting in autumn.",
    likes_count: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
]

const meta: Meta<typeof CommentsSection> = {
  title: 'Organisms/CommentsSection',
  component: CommentsSection,
}

export default meta
type Story = StoryObj<typeof CommentsSection>

export const Default: Story = {
  args: {
    postId,
    initialComments: comments,
    currentUserId: 'user-1',
    initialLikedCommentIds: [],
  },
}

export const Empty: Story = {
  args: {
    postId,
    initialComments: [],
    currentUserId: 'user-1',
    initialLikedCommentIds: [],
  },
}

export const LoggedOut: Story = {
  args: {
    postId,
    initialComments: comments,
    currentUserId: null,
    initialLikedCommentIds: [],
  },
}
