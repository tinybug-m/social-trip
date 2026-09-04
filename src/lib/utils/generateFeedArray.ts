import { Post } from '@/src/lib/types/entities'

export const generateFeedArray = async (reels: Post[], posts: Post[]) => {
  const pattern = ['post', 'post', 'reel']

  const reelsQueue = [...reels]
  const postsQueue = [...posts]

  const feed = []

  while (reelsQueue.length && postsQueue.length >= 2) {
    for (const slot of pattern) {
      if (slot == 'reel') {
        const reel = reelsQueue.shift()!
        feed.push(reel)
      } else {
        const post = postsQueue.shift()!
        feed.push(post)
      }
    }
  }

  return { feed, reelsQueue, postsQueue }
}
