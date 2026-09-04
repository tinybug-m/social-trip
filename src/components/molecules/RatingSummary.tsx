'use client'

import StarRating from '@/src/components/atoms/StarRating'
import { useRatePost } from '@/src/hooks/useRatePost'

export function RatingSummary({
  postId,
  initialMyRating = 0,
  initialAverage = 0,
  initialCount = 0,
  size = 20,
}: {
  postId: string
  initialMyRating?: number
  initialAverage?: number
  initialCount?: number
  size?: number
}) {
  const { myRating, average, count, rate, error } = useRatePost({
    postId,
    initialMyRating,
    initialAverage,
    initialCount,
  })

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <StarRating value={myRating || average} size={size} onRate={rate} />
        <span className="text-xs text-neutral-500">
          {average > 0 ? average.toFixed(1) : 'No ratings'}
          {count > 0 && ` (${count})`}
        </span>
      </div>
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  )
}
