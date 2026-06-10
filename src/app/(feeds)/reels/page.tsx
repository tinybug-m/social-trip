import { ReelsFeed } from '@/src/components/molecules/ReelsFeed'
import { Database } from '@/src/lib/types/database'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
const PAGE_SIZE = 5

export default async function Page() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('type', 'reel')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false })
    .limit(PAGE_SIZE)

  if (error) {
    return null
  }

  return <ReelsFeed initialPosts={data} />
}
