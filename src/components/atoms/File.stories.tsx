import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import File from './File'

const meta: Meta<typeof File> = {
  title: 'Atoms/File',
  component: File,
  argTypes: {
    expectedType: {
      control: 'select',
      options: ['image', 'video'],
    },
  },
}

export default meta
type Story = StoryObj<typeof File>

export const ExpectingImage: Story = {
  args: {
    expectedType: 'image',
    onChange: () => {},
  },
}

export const ExpectingVideo: Story = {
  args: {
    expectedType: 'video',
    onChange: () => {},
  },
}
