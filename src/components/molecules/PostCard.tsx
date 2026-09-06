'use client'

import Link from 'next/link'
import { MessageCircle, MoreHorizontal, MapPin } from 'lucide-react'
import { Post } from '@/src/lib/types/entities'
import { formatRelativeTime } from '@/src/lib/utils/formatRelativeTime'
import { getMapUrl } from '@/src/lib/utils/mapLink'
import { linkifyCaption } from '@/src/lib/utils/linkifyCaption'
import Avatar from '@/src/components/atoms/Avatar'
import ShareButton from '@/src/components/atoms/ShareButton'
import { SaveButton } from '@/src/components/atoms/SaveButton'
import { RatingSummary } from '@/src/components/molecules/RatingSummary'

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="border-b border-[#dbdbdb] pb-3 mb-1">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <Link href={`/profile/${post.user_id}`}>
            <Avatar src={post.user_image} name={post.username} size={32} ring />
          </Link>
          <div className="flex flex-col">
            <Link
              href={`/profile/${post.user_id}`}
              className="text-sm font-semibold leading-tight"
            >
              {post.username}
            </Link>
            {post.location &&
              (post.location_lat && post.location_lng ? (
                <a
                  href={getMapUrl(post.location_lat, post.location_lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-0.5 text-xs text-blue-600 leading-tight hover:underline"
                >
                  <MapPin size={11} />
                  {post.location}
                </a>
              ) : (
                <span className="flex items-center gap-0.5 text-xs text-neutral-500 leading-tight">
                  <MapPin size={11} />
                  {post.location}
                </span>
              ))}
          </div>
        </div>
        <button aria-label="More options">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <Link href={`/post/${post.id}`} className="block bg-black">
        {post.type === 'reel' ? (
          <video
            src={post.media_url}
            className="w-full max-h-[470px] object-cover aspect-square"
            muted
            playsInline
            loop
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.media_url}
            alt={post.caption ?? 'post'}
            className="w-full max-h-[470px] object-cover aspect-square"
          />
        )}
      </Link>

      <div className="flex items-center justify-between px-3 pt-2">
        <RatingSummary
          postId={post.id}
          initialAverage={post.average_rating ?? 0}
          initialCount={post.ratings_count ?? 0}
        />

        <div className="flex items-center gap-4">
          <Link href={`/post/${post.id}`} aria-label="Comment">
            <MessageCircle size={24} strokeWidth={1.8} />
          </Link>
          <ShareButton postId={post.id} />
          <SaveButton />
        </div>
      </div>

      <div className="px-3 pt-2 space-y-1">
        {post.caption && (
          <p className="text-sm">
            <span className="font-semibold mr-1">{post.username}</span>
            {linkifyCaption(post.caption)}
          </p>
        )}

        {(post.comments_count ?? 0) > 0 && (
          <Link
            href={`/post/${post.id}`}
            className="block text-sm text-neutral-500"
          >
            {post.comments_count === 1
              ? 'View 1 comment'
              : `View all ${post.comments_count} comments`}
          </Link>
        )}

        <p className="text-[11px] text-neutral-400 uppercase pt-0.5">
          {formatRelativeTime(post.created_at)}
        </p>
      </div>
    </article>
  )
}
