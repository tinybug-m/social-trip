// TODO : Write top navbar
// TODO : Write bottom navbar

import { getPosts } from '@/src/services/posts/getPost'

// TODO: what the hell is this file doing there (generateFeedArray)
import { generateFeedArray } from '../../test/generateFeedArray'
import { Post } from '@/src/lib/types/entities'
import TopNavBar from '@/src/components/molecules/TopNavBar'
import ExploreGrid from '@/src/components/templates/ExploreGrid'

export default async function InstagramExplore() {
  const { data: dbPosts, error: postsError } = await getPosts('post')
  if (postsError) console.error('Error fetching posts:', postsError.message)

  const { data: dbReels, error } = await getPosts('reel')
  if (error) console.error('Error fetching posts:', error.message)

  const posts: Post[] = dbPosts || []
  const reels: Post[] = dbReels || []

  const { feed } = await generateFeedArray(reels, posts)

  return (
    <div className="font-sans antialiased">
      <TopNavBar />
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
