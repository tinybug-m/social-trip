'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabaseClient } from '@/src/lib/supabase/client'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export function usePushSubscription() {
  const [permission, setPermission] = useState<
    NotificationPermission | 'unsupported'
  >('default')

  const subscribe = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return false
    }

    const permissionResult = await Notification.requestPermission()
    setPermission(permissionResult)
    if (permissionResult !== 'granted') return false

    const registration = await navigator.serviceWorker.register('/sw.js')
    await navigator.serviceWorker.ready

    let subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
      })
    }

    const {
      data: { user },
    } = await supabaseClient.auth.getUser()
    if (!user) return false

    const json = subscription.toJSON()
    if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return false

    const { error } = await supabaseClient.from('push_subscriptions').upsert(
      {
        user_id: user.id,
        endpoint: json.endpoint,
        p256dh: json.keys.p256dh,
        auth: json.keys.auth,
      },
      { onConflict: 'endpoint' },
    )

    return !error
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        typeof window === 'undefined' ||
        !('Notification' in window) ||
        !('serviceWorker' in navigator)
      ) {
        setPermission('unsupported')
        return
      }
      setPermission(Notification.permission)
      // Already granted (returning device/browser): resolves instantly with
      // no prompt, so it's safe to silently keep the subscription fresh.
      if (Notification.permission === 'granted') subscribe()
    }, 0)
    return () => clearTimeout(timer)
  }, [subscribe])

  return { permission, subscribe }
}
