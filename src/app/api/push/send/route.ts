import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'
import { Database } from '@/src/lib/types/database'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
)

export async function POST(request: NextRequest) {
  const { userId, title, body, url } = await request.json()

  if (!userId || !title || !body) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Push notifications are not configured' },
      { status: 501 },
    )
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  )

  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!subscriptions?.length) {
    return NextResponse.json({ sent: 0 })
  }

  const payload = JSON.stringify({ title, body, url: url ?? '/' })

  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        payload,
      ),
    ),
  )

  const staleIds = subscriptions
    .filter((_, i) => {
      const result = results[i]
      return (
        result.status === 'rejected' &&
        (result.reason?.statusCode === 404 || result.reason?.statusCode === 410)
      )
    })
    .map((sub) => sub.id)

  if (staleIds.length) {
    await supabase.from('push_subscriptions').delete().in('id', staleIds)
  }

  const sent = results.filter((r) => r.status === 'fulfilled').length

  return NextResponse.json({ sent })
}
