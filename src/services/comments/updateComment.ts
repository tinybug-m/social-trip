import { supabaseClient } from '@/src/lib/supabase/client'

export const updateComment = async (commentId: string, content: string) => {
  const { data, error } = await supabaseClient
    .from('comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select()
    .single()

  if (error) throw error

  return data
}

export const deleteComment = async (commentId: string) => {
  const { error } = await supabaseClient
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) throw error
}
