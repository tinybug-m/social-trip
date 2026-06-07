'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useHandleForm(action: (data: any) => Promise<any>) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const submit = async (data: any) => {
    setError(null)
    setPending(true)

    try {
      await action(data)
      router.push('/')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unexpected error')
    } finally {
      setPending(false)
    }
  }

  return { submit, error, pending }
}
