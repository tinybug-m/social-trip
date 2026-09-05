'use client'

import { useEffect, useRef, useState } from 'react'
import { supabaseClient } from '@/src/lib/supabase/client'

export function useUnreadMessagesCount() {
  const [count, setCount] = useState(0)
  const userIdRef = useRef<string | null>(null)

  useEffect(() => {
    const loadCount = async () => {
      const userId = userIdRef.current
      if (!userId) return

      const { count: unread } = await supabaseClient
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', userId)
        .is('read_at', null)

      setCount(unread ?? 0)
    }

    const init = async () => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser()
      if (!user) return
      userIdRef.current = user.id
      await loadCount()
    }

    init()

    const channel = supabaseClient
      .channel('unread-messages-badge')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          const row = (payload.new ?? payload.old) as {
            receiver_id?: string
          } | null
          if (!userIdRef.current || row?.receiver_id !== userIdRef.current) {
            return
          }
          loadCount()
        },
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [])

  return count
}
