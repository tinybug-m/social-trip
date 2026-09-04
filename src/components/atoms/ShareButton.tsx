'use client'

import { Send } from 'lucide-react'
import { sharePost } from '@/src/lib/utils/sharePost'

const ShareButton = ({
  postId,
  size = 24,
  className,
}: {
  postId: string
  size?: number
  className?: string
}) => (
  <button
    onClick={() => sharePost(postId)}
    aria-label="Share"
    className={className}
  >
    <Send size={size} strokeWidth={1.8} />
  </button>
)

export default ShareButton
export { ShareButton }
