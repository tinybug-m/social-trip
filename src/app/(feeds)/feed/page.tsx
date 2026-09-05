import { getPosts } from '@/src/services/posts/getPost'
import { Post } from '@/src/lib/types/entities'
import { PostCard } from '@/src/components/molecules/PostCard'

export default async function HomeFeed() {
  const { data: dbPosts, error } = await getPosts('post')
  if (error) console.error('Error fetching posts:', error.message)

  const posts: Post[] = dbPosts || []

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-neutral-500">
        No posts yet. Be the first to share one! 😉
      </div>
    )
  }

  return (
    <div className="pt-1">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
