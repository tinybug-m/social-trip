import { Post } from '@/src/lib/types/entities'

export const generateFeedArray = async (reels: Post[], posts: Post[]) => {
  const pattern = ['post', 'post', 'reel']

  const reelsQueue = [...reels]
  const postsQueue = [...posts]

  const feed = []

  while (reelsQueue.length && postsQueue.length) {
    for (const slot of pattern) {
      if (slot == 'reel') {
        if (!reelsQueue.length) continue
        feed.push(reelsQueue.shift()!)
      } else {
        if (!postsQueue.length) continue
        feed.push(postsQueue.shift()!)
      }
    }
  }

  feed.push(...reelsQueue, ...postsQueue)
  reelsQueue.length = 0
  postsQueue.length = 0

  return { feed, reelsQueue, postsQueue }
}
