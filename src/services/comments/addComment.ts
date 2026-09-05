import { supabaseClient } from '@/src/lib/supabase/client'
import { notifyUser } from '@/src/lib/utils/notifyUser'

export const addComment = async (
  postId: string,
  content: string,
  parentCommentId?: string | null,
) => {
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser()

  if (userError) throw new Error(userError.message)
  if (!user) throw new Error('Login required')

  const { data, error } = await supabaseClient
    .from('comments')
    .insert({
      post_id: postId,
      parent_comment_id: parentCommentId ?? null,
      user_id: user.id,
      username: user.user_metadata?.username || user.email?.split('@')[0],
      user_image: user.user_metadata?.avatar_url || null,
      content,
    })
    .select()
    .single()

  if (error) throw error

  const { data: post } = await supabaseClient
    .from('posts')
    .select('user_id')
    .eq('id', postId)
    .maybeSingle()

  if (post?.user_id && post.user_id !== user.id) {
    const commenterName =
      user.user_metadata?.username || user.email?.split('@')[0]
    notifyUser(post.user_id, {
      title: `${commenterName || 'Someone'} commented on your post`,
      body: content,
      url: `/post/${postId}`,
    })
  }

  return data
}
