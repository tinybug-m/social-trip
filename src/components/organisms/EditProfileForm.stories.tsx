import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { EditProfileForm } from './EditProfileForm'

const meta: Meta<typeof EditProfileForm> = {
  title: 'Organisms/EditProfileForm',
  component: EditProfileForm,
}

export default meta
type Story = StoryObj<typeof EditProfileForm>

export const Default: Story = {
  args: {
    initialUsername: 'sara.travels',
    initialBio: 'Exploring one city at a time ✈️',
    initialAvatarUrl:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200',
  },
}

export const NoAvatarOrBio: Story = {
  args: {
    initialUsername: 'newuser',
    initialBio: '',
    initialAvatarUrl: null,
  },
}
