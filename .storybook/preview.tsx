import type { Preview } from '@storybook/nextjs-vite'
import React from 'react'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] max-w-full mx-auto border-x border-[#dbdbdb] bg-white text-[#262626]">
        <Story />
      </div>
    ),
  ],
}

export default preview
