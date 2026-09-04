import { supabaseClient } from '@/src/lib/supabase/client'

export const ratePost = async (postId: string, rating: number) => {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser()

  if (userError) throw new Error(userError.message)
  if (!user) throw new Error('Login required')

  const { error } = await supabaseClient
    .from('ratings')
    .upsert(
      { post_id: postId, user_id: user.id, rating },
      { onConflict: 'post_id,user_id' },
    )

  if (error) throw error
}

export const getMyRating = async (postId: string) => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser()

  if (!user) return null

  const { data } = await supabaseClient
    .from('ratings')
    .select('rating')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()

  return data?.rating ?? null
}
