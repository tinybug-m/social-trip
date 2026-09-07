import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import CreatePostForm from './CreatePostForm'

const meta: Meta<typeof CreatePostForm> = {
  title: 'Organisms/CreatePostForm',
  component: CreatePostForm,
}

export default meta
type Story = StoryObj<typeof CreatePostForm>

export const Default: Story = {}
