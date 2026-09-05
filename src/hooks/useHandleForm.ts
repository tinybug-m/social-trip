'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useHandleForm<T>(
  action: (data: T, onProgress?: (percent: number) => void) => Promise<unknown>,
) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [progress, setProgress] = useState(0)

  const submit = async (data: T) => {
    setError(null)
    setPending(true)
    setProgress(0)

    try {
      await action(data, setProgress)
      router.push('/')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unexpected error')
    } finally {
      setPending(false)
    }
  }

  return { submit, error, pending, progress }
}
