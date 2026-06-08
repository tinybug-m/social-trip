import { supabaseClient } from '@/src/lib/supabase/client'

// TODO: Replace temporary string type with PostType union.

export const getPosts = async (type: string) => {
  const { data, error } = await supabaseClient
    .from('posts')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false })

  return { data, error }
}
