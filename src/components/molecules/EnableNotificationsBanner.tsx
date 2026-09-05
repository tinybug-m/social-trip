'use client'

import { useEffect, useState } from 'react'
import { Bell, X } from 'lucide-react'
import { usePushSubscription } from '@/src/hooks/usePushSubscription'

const DISMISS_KEY = 'notif-banner-dismissed'

export function EnableNotificationsBanner() {
  const { permission, subscribe } = usePushSubscription()
  const [dismissed, setDismissed] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDismissed(localStorage.getItem(DISMISS_KEY) === '1')
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (permission !== 'default' || dismissed) return null

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }

  const enable = async () => {
    setLoading(true)
    await subscribe()
    setLoading(false)
    dismiss()
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-blue-50 border-b border-blue-100">
      <Bell size={18} className="text-blue-500 shrink-0" />
      <p className="flex-1 text-xs text-blue-900">
        Turn on notifications for new messages and comments.
      </p>
      <button
        onClick={enable}
        disabled={loading}
        className="text-xs font-semibold text-blue-600 shrink-0 disabled:opacity-50"
      >
        {loading ? '...' : 'Enable'}
      </button>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="text-blue-400 shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  )
}
