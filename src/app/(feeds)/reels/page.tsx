import { ReelsFeed } from '@/src/components/molecules/ReelsFeed'
import { supabaseClient } from '@/src/lib/supabase/client'

const PAGE_SIZE = 5

export default async function Page() {
  const { data, error } = await supabaseClient
    .from('posts')
    .select('*')
    .eq('type', 'reel')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(PAGE_SIZE)

  if (error) {
    console.error('Error fetching reels:', error.message)
  }

  return <ReelsFeed initialPosts={data ?? []} />
}
