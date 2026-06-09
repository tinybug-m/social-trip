'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { supabaseClient } from '@/src/lib/supabase/client'
import { Post } from '@/src/lib/types/entities'

// TODO : Make video full screen
// TODO : Add real icons
// TODO : Connect like
// TODO : Write a simple comment component
// TODO : Connect comments
// TODO : Write caption component
// TODO : Clean up the ReelItem.tsx file

export function ReelItem({ post }: { post: Post }) {
  const supabase = supabaseClient
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count ?? 0)
  const [isPending, startTransition] = useTransition()

  // video play/pause
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.75 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  // LIKE (optimistic)
  const handleLike = () => {
    if (isPending) return

    startTransition(async () => {
      const newLiked = !liked
      setLiked(newLiked)
      setLikesCount((c) => c + (newLiked ? 1 : -1))

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      if (newLiked) {
        await supabase.from('likes').insert({
          user_id: user.id,
          post_id: post.id,
        })
      } else {
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', post.id)
      }
    })
  }

  // SHARE (native API)
  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post.id}`

    if (navigator.share) {
      await navigator.share({
        title: 'Check this out',
        url,
      })
    } else {
      await navigator.clipboard.writeText(url)
      alert('Link copied')
    }
  }

  return (
    <div className="h-dvh snap-start relative bg-black">
      <video
        ref={videoRef}
        src={post.media_url}
        className="h-full w-full object-cover"
        loop
        muted
        playsInline
      />

      {/* RIGHT ACTIONS */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 text-white">
        <button onClick={handleLike}>
          ❤️
          <span className="block text-sm">{likesCount}</span>
        </button>

        <button>
          💬
          <span className="block text-sm">{post.comments_count ?? 0}</span>
        </button>

        <button onClick={handleShare}>📤</button>
      </div>

      {/* CAPTION */}
      <div className="absolute bottom-6 left-4 text-white">
        <p>{post.caption}</p>
      </div>
    </div>
  )
}
