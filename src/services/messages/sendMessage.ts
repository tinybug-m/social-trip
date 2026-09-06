import { supabaseClient } from '@/src/lib/supabase/client'
import { notifyUser } from '@/src/lib/utils/notifyUser'
import { getCurrentUser } from '@/src/services/user/getCurrentUser'

export async function sendMessage(receiverId: string, content: string) {
  const user = await getCurrentUser()

  const { data, error } = await supabaseClient
    .from('messages')
    .insert({ sender_id: user.id, receiver_id: receiverId, content })
    .select()
    .single()

  if (error) throw error

  const senderName = user.user_metadata?.username || user.email?.split('@')[0]
  notifyUser(receiverId, {
    title: senderName || 'New message',
    body: content,
    url: `/messages/${user.id}`,
  })

  return data
}
