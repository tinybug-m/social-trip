import { supabaseClient } from '@/src/lib/supabase/client'
import { PostType } from '@/src/lib/types/entities'

export const getPosts = async (type: PostType) => {
  const { data, error } = await supabaseClient
    .from('posts')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false })

  return { data, error }
}
