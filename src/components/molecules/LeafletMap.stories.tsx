import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LeafletMap } from './LeafletMap'

const meta: Meta<typeof LeafletMap> = {
  title: 'Molecules/LeafletMap',
  component: LeafletMap,
}

export default meta
type Story = StoryObj<typeof LeafletMap>

export const Static: Story = {
  args: {
    lat: 33.9831,
    lng: 51.4364,
    zoom: 13,
    height: 260,
  },
}

export const Interactive: Story = {
  args: {
    lat: 33.9831,
    lng: 51.4364,
    zoom: 13,
    height: 260,
    interactive: true,
    onSelect: (lat, lng) => console.log('selected', lat, lng),
  },
}
