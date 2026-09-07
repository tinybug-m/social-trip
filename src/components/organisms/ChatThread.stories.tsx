import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ChatThread } from './ChatThread'
import { Message } from '@/src/lib/types/entities'

const currentUserId = 'user-1'
const otherUserId = 'user-2'

const messages: Message[] = [
  {
    id: 'm1',
    sender_id: otherUserId,
    receiver_id: currentUserId,
    content: 'Hey! Have you been to Kashan?',
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    read_at: new Date().toISOString(),
  },
  {
    id: 'm2',
    sender_id: currentUserId,
    receiver_id: otherUserId,
    content: 'Yes! Just got back, it was amazing.',
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    read_at: new Date().toISOString(),
  },
  {
    id: 'm3',
    sender_id: otherUserId,
    receiver_id: currentUserId,
    content: 'You have to share some photos!',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read_at: null,
  },
]

const meta: Meta<typeof ChatThread> = {
  title: 'Organisms/ChatThread',
  component: ChatThread,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof ChatThread>

export const Default: Story = {
  args: {
    currentUserId,
    otherUserId,
    initialMessages: messages,
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] flex flex-col">
        <Story />
      </div>
    ),
  ],
}

export const Empty: Story = {
  args: {
    currentUserId,
    otherUserId,
    initialMessages: [],
  },
  decorators: [
    (Story) => (
      <div className="h-[600px] flex flex-col">
        <Story />
      </div>
    ),
  ],
}
