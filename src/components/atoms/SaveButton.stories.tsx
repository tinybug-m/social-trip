import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import SaveButton from './SaveButton'

const meta: Meta<typeof SaveButton> = {
  title: 'Atoms/SaveButton',
  component: SaveButton,
}

export default meta
type Story = StoryObj<typeof SaveButton>

export const Default: Story = {
  args: {},
}
