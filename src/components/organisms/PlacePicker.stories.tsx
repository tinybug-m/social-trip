import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { PlacePicker } from './PlacePicker'

const meta: Meta<typeof PlacePicker> = {
  title: 'Organisms/PlacePicker',
  component: PlacePicker,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof PlacePicker>

export const Default: Story = {
  args: {
    onSelect: (place) => console.log('selected', place),
    onClose: () => console.log('closed'),
  },
}
