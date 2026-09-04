import { supabaseClient } from '@/src/lib/supabase/client'

export const getComments = async (postId: string) => {
  const { data, error } = await supabaseClient
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  return { data, error }
}
