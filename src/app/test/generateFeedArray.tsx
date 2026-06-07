import { PostItem } from '../page'

export const generateFeedArray = async (
  reels: PostItem[],
  posts: PostItem[],
) => {
  const pattern = ['post', 'post', 'reel']

  let reelsQueue = [...reels]
  let postsQueue = [...posts]

  let feed = []

  while (reelsQueue.length >= 2 && postsQueue.length) {
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
