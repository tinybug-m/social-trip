import { generateFeedArray } from './generateFeedArray'

const page = () => {
  const reels = [
    { id: 0, type: 'reel' },
    { id: 1, type: 'reel' },
    { id: 3, type: 'reel' },
    { id: 4, type: 'reel' },
  ]

  const posts = [
    { id: 2, type: 'post' },
    { id: 5, type: 'post' },
    { id: 6, type: 'post' },
    { id: 7, type: 'post' },
    { id: 8, type: 'post' },
    { id: 9, type: 'post' },
    { id: 10, type: 'post' },
  ]

  const feeds = generateFeedArray(reels, posts)

  console.log(feeds)

  return <div>page</div>
}

export default page
