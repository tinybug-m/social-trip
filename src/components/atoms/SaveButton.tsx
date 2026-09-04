'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'

const SaveButton = ({ size = 24 }: { size?: number }) => {
  const [saved, setSaved] = useState(false)

  return (
    <button
      onClick={() => setSaved((s) => !s)}
      aria-label={saved ? 'Remove from saved' : 'Save'}
    >
      <Bookmark
        size={size}
        strokeWidth={1.8}
        fill={saved ? 'currentColor' : 'none'}
      />
    </button>
  )
}

export default SaveButton
export { SaveButton }
