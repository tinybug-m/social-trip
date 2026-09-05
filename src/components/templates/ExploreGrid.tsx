'use client'

import { Star, MessageCircle, Clapperboard } from 'lucide-react'
import { Tables } from '@/src/lib/types/database'
import Link from 'next/link'

type ExploreProps = {
  feed: Tables<'posts'>[]
}

const ExploreGrid = (props: ExploreProps) => {
  const { feed } = props

  return (
    <main className="p-0.5">
      <div className="grid grid-cols-3 gap-0.5 auto-rows-[120px]">
        {feed.map((item) => {
          const isReel = item?.type === 'reel'

          return (
            <Link
              key={item?.id}
              href={`/post/${item?.id}`}
              className={`relative group overflow-hidden cursor-pointer bg-neutral-100 block ${isReel ? 'row-span-2' : ''}`}
            >
              {isReel ? (
                <video
                  src={item?.media_url}
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={item?.media_url}
                  alt={item?.caption || 'Explore media'}
                  className="w-full h-full object-cover transition duration-300 group-hover:opacity-80"
                  loading="lazy"
                />
              )}

              {isReel && (
                <div className="absolute top-2 right-2 text-white drop-shadow">
                  <Clapperboard className="w-4 h-4" fill="white" />
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-semibold text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 fill-white" />
                  <span>{item?.average_rating ?? 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5 fill-white" />
                  <span>{item?.comments_count ?? 0}</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}

export default ExploreGrid
