import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { NewMessageSearch } from './NewMessageSearch'

const meta: Meta<typeof NewMessageSearch> = {
  title: 'Organisms/NewMessageSearch',
  component: NewMessageSearch,
  parameters: {
    docs: {
      description: {
        component:
          'Searches the live profiles table as you type. In this environment it queries the real (or unavailable) Supabase project, so results depend on what data actually exists there.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof NewMessageSearch>

export const Default: Story = {}
