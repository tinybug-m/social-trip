import { Search } from 'lucide-react'
import { cookies } from 'next/headers'
import { createClientServer } from '@/src/lib/supabase/server'
import { generateFeedArray } from './test/generateFeedArray'
import ExploreGrid from '../components/templates/ExploreGrid'
import { Post } from '../lib/types/entities'

export default async function InstagramExplore() {
  const cookieStore = await cookies()

  const supabase = createClientServer({
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
    },
  })

  const { data: dbPosts, error: postsError } = await supabase
    .from('posts')
    .select('*')
    .eq('type', 'post')
    .order('created_at', { ascending: false })

  if (postsError) {
    console.error('Error fetching posts:', postsError.message)
  }

  const { data: dbReels, error } = await supabase
    .from('posts')
    .select('*')
    .eq('type', 'reel')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error.message)
  }
  console.log({ dbReels })

  const posts: Post[] = dbPosts || []
  const reels: Post[] = dbReels || []

  const { feed } = await generateFeedArray(reels, posts)

  console.log({ feed })
  return (
    <div className="bg-zinc-950 min-h-screen text-gray-100 font-sans antialiased">
      <div className="sticky top-0 bg-zinc-950/80 backdrop-blur-md z-50 px-4 py-3 max-w-4xl mx-auto border-b border-zinc-900">
        <div className="relative flex items-center bg-zinc-900 rounded-xl px-3 py-2 text-gray-400 border border-zinc-800/50">
          <Search className="w-4 h-4 ml-2 text-zinc-500" />
          <input
            type="text"
            placeholder="جستجو..."
            className="bg-transparent w-full focus:outline-none text-sm text-right pr-1 text-white placeholder-zinc-500"
            dir="rtl"
          />
        </div>
      </div>
      {feed.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          هنوز هیچ پستی منتشر نشده است. اولین پست را خودت بساز! 😉
        </div>
      ) : (
        <ExploreGrid feed={feed} />
      )}
    </div>
  )
}
