import { supabaseClient } from '@/src/lib/supabase/client'
import ExploreGrid from '@/src/components/templates/ExploreGrid'
import { Post } from '@/src/lib/types/entities'

type Props = PageProps<'/explore/tags/[tag]'>

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)

  const { data, error } = await supabaseClient
    .from('posts')
    .select('*')
    .ilike('caption', `%#${decodedTag}%`)
    .order('created_at', { ascending: false })

  if (error) console.error('Error fetching tag posts:', error.message)

  const posts: Post[] = data ?? []

  return (
    <div>
      <h1 className="px-4 py-3 text-lg font-semibold">#{decodedTag}</h1>

      {posts.length === 0 ? (
        <p className="text-center py-16 text-neutral-400 text-sm">
          No posts tagged #{decodedTag} yet.
        </p>
      ) : (
        <ExploreGrid feed={posts} />
      )}
    </div>
  )
}
