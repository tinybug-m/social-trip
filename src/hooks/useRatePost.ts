'use client'

import { useRef, useState, useTransition } from 'react'
import { ratePost } from '@/src/services/ratings/ratePost'

export function useRatePost({
  postId,
  initialMyRating = 0,
  initialAverage = 0,
  initialCount = 0,
}: {
  postId: string
  initialMyRating?: number
  initialAverage?: number
  initialCount?: number
}) {
  const [myRating, setMyRating] = useState(initialMyRating)
  const [average, setAverage] = useState(initialAverage)
  const [count, setCount] = useState(initialCount)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const submitInFlight = useRef(false)

  const rate = (value: number) => {
    if (submitInFlight.current) return
    submitInFlight.current = true

    const prevRating = myRating
    const prevAverage = average
    const prevCount = count

    const nextCount = prevRating > 0 ? prevCount : prevCount + 1
    const nextSum =
      average * prevCount - (prevRating > 0 ? prevRating : 0) + value
    const nextAverage = Math.round((nextSum / nextCount) * 100) / 100

    setMyRating(value)
    setAverage(nextAverage)
    setCount(nextCount)
    setError(null)

    startTransition(async () => {
      try {
        await ratePost(postId, value)
      } catch (e) {
        setMyRating(prevRating)
        setAverage(prevAverage)
        setCount(prevCount)
        setError(e instanceof Error ? e.message : 'Could not save rating')
      } finally {
        submitInFlight.current = false
      }
    })
  }

  return { myRating, average, count, rate, isPending, error }
}
