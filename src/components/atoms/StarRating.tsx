'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

interface StarRatingProps {
  value: number
  size?: number
  onRate?: (rating: number) => void
  disabled?: boolean
}

const StarRating = ({
  value,
  size = 20,
  onRate,
  disabled,
}: StarRatingProps) => {
  const [hovered, setHovered] = useState<number | null>(null)
  const interactive = Boolean(onRate) && !disabled
  const displayValue = hovered ?? value

  return (
    <div
      className="inline-flex items-center gap-0.5"
      onMouseLeave={() => setHovered(null)}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= Math.round(displayValue)

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onRate?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            className={interactive ? 'cursor-pointer' : 'cursor-default'}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              className={filled ? 'text-yellow-500' : 'text-neutral-300'}
              fill={filled ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
