'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { supabaseClient } from '@/src/lib/supabase/client'
import { ReelItem } from './ReelItem'
import { Post } from '@/src/lib/types/entities'

const PAGE_SIZE = 5

export function ReelsFeed({ initialPosts }: { initialPosts: Post[] }) {
  const supabase = supabaseClient

  const [posts, setPosts] = useState(initialPosts)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || posts.length === 0) return

    setLoading(true)

    const last = posts[posts.length - 1]

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('type', 'reel')
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .lt('created_at', last.created_at)
      .limit(PAGE_SIZE)

    if (error || !data || data.length === 0) {
      setHasMore(false)
    } else {
      setPosts((prev) => [...prev, ...data])
    }

    setLoading(false)
  }, [loading, hasMore, posts, supabase])

  useEffect(() => {
    if (!loadMoreRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.8 },
    )

    observer.observe(loadMoreRef.current)

    return () => observer.disconnect()
  }, [loadMore])

  return (
    <div className="h-full overflow-y-scroll snap-y snap-mandatory">
      {posts.map((post) => (
        <ReelItem key={post.id} post={post} />
      ))}

      {hasMore && <div ref={loadMoreRef} className="h-10" />}
    </div>
  )
}
