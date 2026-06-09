import { generateFeedArray } from './test/generateFeedArray'
import ExploreGrid from '../components/templates/ExploreGrid'
import { Post } from '../lib/types/entities'
import { getPosts } from '../services/posts/getPost'

// TODO : Write top navbar
// TODO : Write bottom navbar

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
