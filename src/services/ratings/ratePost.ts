import { supabaseClient } from '@/src/lib/supabase/client'
import { notifyUser } from '@/src/lib/utils/notifyUser'

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

  const { data: post } = await supabaseClient
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .maybeSingle()

  if (post?.user_id && post.user_id !== user.id) {
    const raterName = user.user_metadata?.username || user.email?.split('@')[0]
    notifyUser(post.user_id, {
      title: 'New rating',
      body: `${raterName || 'Someone'} rated your post ${rating}/5`,
      url: `/post/${postId}`,
    })
  }
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
