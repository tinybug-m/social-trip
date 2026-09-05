import { supabaseClient } from '@/src/lib/supabase/client'
import { notifyUser } from '@/src/lib/utils/notifyUser'

export async function sendMessage(receiverId: string, content: string) {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser()

  if (userError) throw new Error(userError.message)
  if (!user) throw new Error('Login required')

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
