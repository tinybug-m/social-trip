import { supabaseClient } from '@/src/lib/supabase/client'

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

  return data
}
