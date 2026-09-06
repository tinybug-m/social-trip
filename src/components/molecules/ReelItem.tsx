'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Star,
  MessageCircle,
  MoreHorizontal,
  Volume2,
  VolumeX,
  MapPin,
} from 'lucide-react'
import { Post } from '@/src/lib/types/entities'
import { getMapUrl } from '@/src/lib/utils/mapLink'
import { linkifyCaption } from '@/src/lib/utils/linkifyCaption'
import { useRatePost } from '@/src/hooks/useRatePost'
import Avatar from '@/src/components/atoms/Avatar'
import StarRating from '@/src/components/atoms/StarRating'
import ShareButton from '@/src/components/atoms/ShareButton'

export function ReelItem({ post }: { post: Post }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const [muted, setMuted] = useState(true)
  const [showRatingPicker, setShowRatingPicker] = useState(false)

  const { myRating, average, count, rate } = useRatePost({
    postId: post.id,
    initialAverage: post.average_rating ?? 0,
    initialCount: post.ratings_count ?? 0,
  })

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

  return (
    <div className="h-dvh snap-start relative bg-black max-h-full">
      <video
        ref={videoRef}
        src={post.media_url}
        className="h-full w-full object-cover"
        loop
        muted={muted}
        playsInline
        onClick={() => setMuted((m) => !m)}
      />

      {/* AUTHOR ROW */}
      <div className="absolute top-15 left-3 right-16 flex items-center gap-2 text-white">
        <Link href={`/profile/${post.user_id}`}>
          <Avatar src={post.user_image} name={post.username} size={32} />
        </Link>
        <Link
          href={`/profile/${post.user_id}`}
          className="text-sm font-semibold drop-shadow"
        >
          {post.username}
        </Link>
        <button className="ml-2 text-xs font-semibold border border-white/70 rounded-md px-2.5 py-1">
          Follow
        </button>
      </div>

      {/* MUTE TOGGLE */}
      <button
        onClick={() => setMuted((m) => !m)}
        className="absolute top-15 right-3 text-white"
        aria-label="Toggle mute"
      >
        {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
      </button>

      {/* RIGHT ACTIONS */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 text-white">
        <div className="relative flex flex-col items-center">
          {showRatingPicker && (
            <>
              <button
                className="fixed inset-0 z-0 cursor-default"
                onClick={() => setShowRatingPicker(false)}
                aria-label="Close rating picker"
                tabIndex={-1}
              />
              <div className="absolute right-9 bottom-0 z-10 bg-black/80 rounded-full px-2 py-1.5">
                <StarRating
                  value={myRating}
                  size={20}
                  onRate={(value) => {
                    rate(value)
                    setShowRatingPicker(false)
                  }}
                />
              </div>
            </>
          )}
          <button
            onClick={() => setShowRatingPicker((s) => !s)}
            className="flex flex-col items-center gap-1"
          >
            <Star
              size={28}
              className={myRating ? 'text-yellow-500' : 'text-white'}
              fill={myRating ? 'currentColor' : 'none'}
              strokeWidth={1.8}
            />
            <span className="text-xs font-semibold drop-shadow">
              {average > 0 ? average.toFixed(1) : count}
            </span>
          </button>
        </div>

        <Link
          href={`/post/${post.id}`}
          className="flex flex-col items-center gap-1"
        >
          <MessageCircle size={27} strokeWidth={1.8} />
          <span className="text-xs font-semibold drop-shadow">
            {post.comments_count ?? 0}
          </span>
        </Link>

        <ShareButton
          postId={post.id}
          size={26}
          className="flex flex-col items-center gap-1"
        />

        <button>
          <MoreHorizontal size={24} strokeWidth={1.8} />
        </button>
      </div>

      {/* CAPTION */}
      <div className="absolute bottom-20 left-3 right-16 text-white">
        {post.location &&
          (post.location_lat && post.location_lng ? (
            <a
              href={getMapUrl(post.location_lat, post.location_lng)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium mb-1 drop-shadow underline"
            >
              <MapPin size={13} />
              {post.location}
            </a>
          ) : (
            <p className="flex items-center gap-1 text-xs font-medium mb-1 drop-shadow">
              <MapPin size={13} />
              {post.location}
            </p>
          ))}
        <p className="text-sm line-clamp-2">
          {post.caption &&
            linkifyCaption(post.caption, 'text-sky-300 font-medium')}
        </p>
      </div>
    </div>
  )
}
