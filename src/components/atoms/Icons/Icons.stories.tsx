import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { HomeIcon, ExploreIcon, AddIcon, SearchIcon } from '.'

const icons = [
  { name: 'HomeIcon', Icon: HomeIcon },
  { name: 'ExploreIcon', Icon: ExploreIcon },
  { name: 'AddIcon', Icon: AddIcon },
  { name: 'SearchIcon', Icon: SearchIcon },
]

const meta: Meta = {
  title: 'Atoms/Icons',
}

export default meta
type Story = StoryObj

export const AllIcons: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6 p-6">
      {icons.map(({ name, Icon }) => (
        <div key={name} className="flex flex-col items-center gap-2">
          <Icon size={28} />
          <span className="text-xs text-neutral-500">{name}</span>
        </div>
      ))}
    </div>
  ),
}
