import { supabaseClient } from '@/src/lib/supabase/client'

export const likeComment = async (commentId: string, userId: string) => {
  const { error } = await supabaseClient
    .from('comment_likes')
    .insert({ comment_id: commentId, user_id: userId })

  if (error) throw error
}

export const unlikeComment = async (commentId: string, userId: string) => {
  const { error } = await supabaseClient
    .from('comment_likes')
    .delete()
    .eq('comment_id', commentId)
    .eq('user_id', userId)

  if (error) throw error
}

export const getLikedCommentIds = async (
  commentIds: string[],
  userId: string,
) => {
  if (commentIds.length === 0) return new Set<string>()

  const { data, error } = await supabaseClient
    .from('comment_likes')
    .select('comment_id')
    .eq('user_id', userId)
    .in('comment_id', commentIds)

  if (error || !data) return new Set<string>()

  return new Set(data.map((row) => row.comment_id))
}
